import { Link } from "@tanstack/react-router";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Logo } from "../common/Logo";

export function Footer() {
  return (
    <footer id="contact" className="relative mt-24 border-t border-white/10 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              NeuroLearn AI is a smart, emotion-based learning platform that adapts to how every
              learner feels — in real time.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/10 transition"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-foreground">
                  Analytics
                </Link>
              </li>
              <li>
                <a href="#courses" className="hover:text-foreground">
                  Courses
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="mailto:hello@neurolearn.ai" className="hover:text-foreground">
                  hello@neurolearn.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} NeuroLearn AI. All rights reserved.</div>
          <div>Crafted with adaptive intelligence.</div>
        </div>
      </div>
    </footer>
  );
}
