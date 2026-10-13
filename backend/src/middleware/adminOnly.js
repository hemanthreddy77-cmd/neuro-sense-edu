/**
 * Admin role guard middleware:
 * Requires req.user to be attached by verifyAuth and have role === 'admin'
 */
export function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required before checking admin role.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin privileges required to access this resource.",
    });
  }

  next();
}
