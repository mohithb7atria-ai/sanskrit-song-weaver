import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const chandasOptions = [
  { value: "anushtubh", label: "Anuṣṭubh (अनुष्टुभ्)" },
  { value: "trishtubh", label: "Triṣṭubh (त्रिष्टुभ्)" },
];

const melodyOptions = [
  { value: "low", label: "Low (मन्द्र)" },
  { value: "medium", label: "Medium (मध्य)" },
  { value: "high", label: "High (तार)" },
];

const SanskritChanter = () => {
  const [verse, setVerse] = useState("");
  const [chandas, setChandas] = useState("");
  const [melody, setMelody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!verse.trim()) {
      toast.error("Please enter a Sanskrit verse");
      return;
    }
    if (!chandas) {
      toast.error("Please select a Chandas");
      return;
    }
    if (!melody) {
      toast.error("Please select a Melody");
      return;
    }

    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((r) => setTimeout(r, 1500));
    setIsGenerating(false);
    toast.info("Audio generation requires a backend service. Connect one to enable this feature.");
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Decorative top element */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p className="text-accent text-lg tracking-[0.3em] uppercase mb-2 font-body">
          वैदिक पाठ
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          Sanskrit Chant Generator
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto font-body text-sm">
          Enter a verse, choose the meter and melody, and generate sacred chanting audio.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Verse Input */}
        <div className="space-y-2">
          <label className="text-sm font-display font-semibold text-foreground">
            Sanskrit Verse
          </label>
          <Textarea
            placeholder="धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः..."
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            className="min-h-[120px] bg-card border-border font-body text-base resize-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-display font-semibold text-foreground">
              Chandas (छन्दस्)
            </label>
            <Select value={chandas} onValueChange={setChandas}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent>
                {chandasOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-display font-semibold text-foreground">
              Melody (स्वर)
            </label>
            <Select value={melody} onValueChange={setMelody}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Select pitch" />
              </SelectTrigger>
              <SelectContent>
                {melodyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-12 text-base font-display font-semibold bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-5 w-5" />
              Generate Chant
            </>
          )}
        </Button>

        {/* Audio Player */}
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
          >
            <button
              onClick={togglePlayback}
              className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full w-0 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-body">Ready to play</p>
            </div>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          </motion.div>
        )}

        {/* Decorative footer */}
        <div className="text-center pt-4">
          <span className="text-accent text-2xl tracking-widest">॥ ॐ ॥</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SanskritChanter;
