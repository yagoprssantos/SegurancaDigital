package br.com.segurancadigital.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class RequestGuardsFilter extends OncePerRequestFilter {

    private static final int DEFAULT_MAX_CONCURRENT = 32;

    private static final int NORMAL_RPM = 120;
    private static final int HEAVY_RPM = 15;

    private static final long REFILL_WINDOW_MILLIS = 60_000L;

    private final ObjectMapper objectMapper;

    private final Semaphore inFlight;

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RequestGuardsFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        int maxConcurrent = readPositiveInt("MAX_CONCURRENT_REQUESTS", DEFAULT_MAX_CONCURRENT);
        this.inFlight = new Semaphore(maxConcurrent);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        String ip = clientIp(request);

        RateProfile profile = classify(path);
        if (!tryConsumeToken(ip, profile)) {
            writeError(response, 429, "rate_limit", "Muitas requisições. Tente novamente em instantes.", path);
            return;
        }

        if (!inFlight.tryAcquire()) {
            writeError(response, 503, "busy", "Servidor ocupado. Tente novamente em instantes.", path);
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            inFlight.release();
        }
    }

    private RateProfile classify(String path) {
        if (path == null) return RateProfile.NORMAL;
        String p = path.toLowerCase(Locale.ROOT);
        if (p.startsWith("/crack-de-senha") || p.startsWith("/quebra-") || p.startsWith("/diffie-hellman")) {
            return RateProfile.HEAVY;
        }
        return RateProfile.NORMAL;
    }

    private boolean tryConsumeToken(String ip, RateProfile profile) {
        long now = System.currentTimeMillis();
        String key = ip + ":" + profile.name();

        AtomicBoolean allowed = new AtomicBoolean(false);
        buckets.compute(key, (k, existing) -> {
            Bucket bucket = existing == null ? Bucket.fresh(profile, now) : existing;
            bucket.refill(now);
            if (bucket.tryConsume()) {
                allowed.set(true);
            }
            bucket.lastSeenMillis = now;
            return bucket;
        });

        return allowed.get();
    }

    private void writeError(HttpServletResponse response, int status, String error, String message, String path)
            throws IOException {
        response.setStatus(status);
        if (status == 429) {
            // best-effort hint; clients may back off
            response.setHeader("Retry-After", "60");
        }
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        Map<String, Object> body = Map.of(
            "status", status,
                "error", error,
                "message", message,
                "path", path,
                "timestamp", Instant.now().toString()
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    private static String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // first IP in the list
            int comma = xff.indexOf(',');
            return (comma >= 0 ? xff.substring(0, comma) : xff).trim();
        }
        String xrip = request.getHeader("X-Real-IP");
        if (xrip != null && !xrip.isBlank()) return xrip.trim();
        return request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
    }

    private static int readPositiveInt(String env, int fallback) {
        String raw = System.getenv(env);
        if (raw == null || raw.isBlank()) return fallback;
        try {
            int v = Integer.parseInt(raw.trim());
            return v > 0 ? v : fallback;
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private enum RateProfile { NORMAL, HEAVY }

    private static final class Bucket {
        private final int capacity;
        private int tokens;
        private long windowStartMillis;
        private long lastSeenMillis;

        private Bucket(int capacity, long now) {
            this.capacity = capacity;
            this.tokens = capacity;
            this.windowStartMillis = now;
            this.lastSeenMillis = now;
        }

        static Bucket fresh(RateProfile profile, long now) {
            return new Bucket(profile == RateProfile.HEAVY ? HEAVY_RPM : NORMAL_RPM, now);
        }

        void refill(long now) {
            long elapsed = now - windowStartMillis;
            if (elapsed >= REFILL_WINDOW_MILLIS) {
                // reset the window
                windowStartMillis = now;
                tokens = capacity;
            }
        }

        boolean tryConsume() {
            if (tokens <= 0) return false;
            tokens--;
            return true;
        }
    }
}
