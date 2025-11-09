import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Heart, AlertTriangle, Radio, MapPin, Bell, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import safetrackLogo from "@/assets/safetrack-logo.png";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary/5 to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto">
            <div className="flex-shrink-0 animate-float">
              <img src={safetrackLogo} alt="SafeTrack Logo" className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl" />
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left">
              <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed font-semibold">
                AI-Powered Child Safety Monitoring System
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Never worry about hot car dangers again. Real-time monitoring with Bluetooth sensors, GPS tracking, and
                intelligent multi-tier emergency alerts powered by Google Cloud AI.
              </p>
              <div className="flex justify-center md:justify-start pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-lg px-10 py-6 gradient-primary text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Access Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Intelligent Safety Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Advanced technology meets parent peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-green-50/50 hover:border-green-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full gradient-safe flex items-center justify-center mb-4 shadow-lg">
                  <Radio className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">Real-Time BLE Monitoring</CardTitle>
                <CardDescription className="text-base">
                  Continuous car seat buckle & PIR motion sensor data via Bluetooth Low Energy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-cyan-50/50 hover:border-cyan-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">GPS Location Tracking</CardTitle>
                <CardDescription className="text-base">
                  Always know your vehicle's exact location with real-time GPS positioning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-yellow-50/50 hover:border-yellow-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full gradient-warning flex items-center justify-center mb-4 shadow-lg">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">Hot Car Detection</CardTitle>
                <CardDescription className="text-base">
                  AI analyzes temperature, presence, and time to detect dangerous situations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-red-50/50 hover:border-red-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full gradient-alert flex items-center justify-center mb-4 shadow-lg">
                  <Bell className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">Multi-Tier Alerts</CardTitle>
                <CardDescription className="text-base">
                  Escalating notifications to caregivers, contacts, and emergency services
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-blue-50/50 hover:border-blue-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">Offline Resilience</CardTitle>
                <CardDescription className="text-base">
                  Local alerts continue working even without internet connectivity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent bg-gradient-to-br from-white to-purple-50/50 hover:border-purple-400 transition-all hover:shadow-xl hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl font-display font-semibold">Privacy First</CardTitle>
                <CardDescription className="text-base">
                  End-to-end encryption with family-controlled data access
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-muted/20 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              How SafeTrack Works
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Powered by Google Cloud AI & Multi-Agent Architecture
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-6 group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Continuous Monitoring</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  BLE sensors in car seat monitor buckle state, child presence, temperature, and motion at 1-2 Hz
                  frequency
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-warning flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">AI Risk Analysis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Multi-agent system on Cloud Run evaluates risk state (SAFE → WATCH → ALERT → CRITICAL) using weather
                  data and time thresholds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-alert flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Smart Escalation</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Automated alert ladder: local siren → primary caregiver → secondary contacts → emergency services
                  (with human verification)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-safe flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Peace of Mind</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  One-tap acknowledgment clears alerts; complete audit trail for all events; works offline with cellular
                  fallback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Heart className="h-16 w-16 mx-auto mb-6 animate-heartbeat text-destructive drop-shadow-lg" />
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">Every Second Counts</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground font-medium">
            Join the future of child safety with AI-powered monitoring that never sleeps
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="text-lg px-10 py-7 gradient-primary text-white hover:opacity-90 shadow-2xl hover:shadow-glow transition-all hover:scale-110 font-semibold"
          >
            <Shield className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm font-medium">
            SafeTrack - Google Cloud AI Agents Hackathon Demo | Built with Cloud Run, AI Studio & ADK
          </p>
        </div>
      </footer>
    </div>
  );
}
