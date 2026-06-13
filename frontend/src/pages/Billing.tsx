import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StudioSidebar from "@/components/StudioSidebar";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  planKey: "free" | "pro" | "pro_plus";
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "",
    planKey: "free",
    description: "Try it out with 1 free generation",
    features: [
      "1 free image generation (Entry Stage only)",
      "Basic AI model",
      "Standard resolution",
      "Community support",
    ],
  },
  {
    id: "pro_monthly",
    name: "Pro",
    price: "₹999",
    period: "/month",
    planKey: "pro",
    description: "For professional wedding planners",
    popular: true,
    features: [
      "3 moodboard generations",
      "All 5 stages unlocked",
      "Advanced AI model",
      "High resolution exports",
      "Priority support",
      "Save & organize projects",
    ],
  },
  {
    id: "pro_plus",
    name: "Pro Plus",
    price: "₹4,999",
    period: "/month",
    planKey: "pro_plus",
    description: "Unlimited creative freedom",
    features: [
      "Unlimited image & moodboard generations",
      "Max AI model",
      "4K resolution exports",
      "Dedicated account manager",
      "Custom branding options",
      "API access",
    ],
  },
];

const Billing: React.FC = () => {
  const { profile, isAuthenticated, loading: authLoading, upgradePlan } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan: Plan) => {
    if (plan.planKey === "free") return;
    setLoading(plan.id);
    try {
      await upgradePlan(plan.planKey);
      toast({ title: "Plan Upgraded! 🎉", description: `You're now on the ${plan.name} plan.` });
    } catch {
      toast({ title: "Error", description: "Could not upgrade. Try again.", variant: "destructive" });
    }
    setLoading(null);
  };

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudioSidebar
        activeTab="billing"
        onTabChange={() => {}}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 lg:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-body mb-4">
              <Crown size={14} />
              Upgrade Your Plan
            </div>
            <h1 className="font-heading text-3xl lg:text-4xl text-foreground mb-3">
              Choose Your <span className="text-gradient-gold">Perfect Plan</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">
              Unlock unlimited moodboard generations and premium features for your wedding planning business.
            </p>
          </div>

          <div className="mb-10 glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-secondary" />
              <div>
                <p className="text-sm font-body font-medium text-foreground">
                  Current Plan: <span className="capitalize">{profile?.plan || "free"}</span>
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {profile?.credits ?? 0} credits remaining
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isCurrent = plan.planKey === profile?.plan;

              return (
                <div
                  key={plan.id}
                  className={`relative glass rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg ${
                    plan.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                        <Sparkles size={12} />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-heading text-xl text-foreground mb-1">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="font-heading text-3xl text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground font-body">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-body text-foreground">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full font-body"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={isCurrent || loading === plan.id}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {loading === plan.id
                      ? "Processing..."
                      : isCurrent
                      ? "Current Plan"
                      : plan.planKey === "free"
                      ? "Get Started"
                      : "Subscribe Now"}
                  </Button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-10">
            Payments are securely processed. Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
