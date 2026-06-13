import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StudioSidebar from "@/components/StudioSidebar";
import mockTemplates, { type Template } from "@/data/mockTemplates";
import { ArrowLeft, Crown, ShoppingBag, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Templates: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    // Simulate payment
    await new Promise((r) => setTimeout(r, 1800));
    setPurchasing(false);
    toast({
      title: "Template Purchased! 🎉",
      description: `"${selectedTemplate?.name}" has been added to your studio.`,
    });
    setSelectedTemplate(null);
  };

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StudioSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <div className="glass m-3 mb-0 rounded-xl p-4 pl-16 lg:pl-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/studio")}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Studio
            </button>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="font-heading text-xl text-foreground">Premium Templates</h1>
              <p className="text-xs text-muted-foreground font-body">
                Curated moodboards by top wedding designers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-body text-lovers-gold bg-lovers-gold/10 px-3 py-1.5 rounded-full border border-lovers-gold/20">
            <Crown size={14} />
            Premium Collection
          </div>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mockTemplates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
              className="group glass rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={tpl.imageUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Theme badge */}
                <span className="absolute top-3 left-3 text-[10px] font-body font-semibold uppercase tracking-wider bg-white/70 dark:bg-black/50 backdrop-blur-md text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full border border-white/30 dark:border-white/10">
                  {tpl.theme}
                </span>
                {/* Price badge */}
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-body font-semibold bg-lovers-gold/90 text-white px-2.5 py-1 rounded-full shadow-md">
                  <Crown size={10} />
                  ₹{tpl.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-heading text-base text-foreground mb-1 group-hover:text-lovers-blush transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-[11px] font-body text-lovers-gold flex items-center gap-1 mb-3">
                  <Crown size={11} />
                  Premium Add-on: ₹{tpl.price}
                </p>
                <button
                  onClick={() => setSelectedTemplate(tpl)}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-body font-semibold text-white bg-lovers-blush/80 hover:bg-lovers-blush backdrop-blur-sm border border-white/20 shadow-md shadow-lovers-blush/15 transition-all duration-300"
                >
                  <ShoppingBag size={14} />
                  Purchase & Use Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !purchasing && setSelectedTemplate(null)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => !purchasing && setSelectedTemplate(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>

              {/* Modal Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-body font-semibold uppercase tracking-wider bg-lovers-gold/10 text-lovers-gold px-2 py-0.5 rounded-full border border-lovers-gold/20">
                    {selectedTemplate.theme}
                  </span>
                </div>
                <h2 className="font-heading text-2xl text-foreground mt-2 mb-1">
                  {selectedTemplate.name}
                </h2>
                <p className="text-sm font-body text-muted-foreground mb-5">
                  This premium template is a one-time purchase and is not included in monthly subscriptions.
                </p>

                {/* Price Breakdown */}
                <div className="bg-white/40 dark:bg-white/5 rounded-xl p-4 mb-5 border border-white/30 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-body text-muted-foreground">Template price</span>
                    <span className="text-lg font-heading text-lovers-gold font-semibold">
                      ₹{selectedTemplate.price}
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-lovers-blush/15 to-transparent my-2" />
                  <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <Check size={12} className="text-green-500" />
                    One-time payment · Instant access · High-resolution assets
                  </div>
                </div>

                {/* Purchase Button */}
                <motion.button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-body font-semibold text-sm text-white bg-lovers-blush/80 hover:bg-lovers-blush backdrop-blur-sm border border-white/20 shadow-lg shadow-lovers-blush/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Confirm Purchase — ₹{selectedTemplate.price}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
