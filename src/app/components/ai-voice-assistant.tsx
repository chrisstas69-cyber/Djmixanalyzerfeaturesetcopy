import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, MessageSquare, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: string;
}

export function AIVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceResponse, setVoiceResponse] = useState("");

  // Mock voice commands
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = "";

    if (lowerCommand.includes("play") || lowerCommand.includes("start")) {
      response = "Playing track";
      toast.success("Track playing");
    } else if (lowerCommand.includes("pause") || lowerCommand.includes("stop")) {
      response = "Paused playback";
      toast.info("Playback paused");
    } else if (lowerCommand.includes("next") || lowerCommand.includes("skip")) {
      response = "Skipping to next track";
      toast.info("Next track");
    } else if (lowerCommand.includes("volume up") || lowerCommand.includes("louder")) {
      response = "Increasing volume";
      toast.info("Volume increased");
    } else if (lowerCommand.includes("volume down") || lowerCommand.includes("quieter")) {
      response = "Decreasing volume";
      toast.info("Volume decreased");
    } else if (lowerCommand.includes("reverb") || lowerCommand.includes("add reverb")) {
      response = "Adding reverb effect";
      toast.info("Reverb enabled");
    } else if (lowerCommand.includes("bpm") || lowerCommand.includes("tempo")) {
      response = "Adjusting BPM";
      toast.info("BPM adjusted");
    } else {
      response = "I didn't understand that command. Try: play, pause, next, volume up/down";
    }

    const newCommand: VoiceCommand = {
      id: `cmd-${Date.now()}`,
      command,
      response,
      timestamp: new Date().toISOString(),
    };

    setCommands([newCommand, ...commands.slice(0, 9)]);
    setVoiceResponse(response);

    if (ttsEnabled) {
      // In production, use Web Speech API
      setTimeout(() => setVoiceResponse(""), 3000);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    toast.info("Listening... Say a command");
    // Simulate voice recognition
    setTimeout(() => {
      const mockCommands = [
        "play next track",
        "increase volume",
        "add reverb",
        "pause playback",
        "skip track",
      ];
      const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      handleVoiceCommand(randomCommand);
      setIsListening(false);
    }, 2000);
  };

  const exampleCommands = [
    "Play next track",
    "Increase volume",
    "Add reverb",
    "Pause playback",
    "Skip track",
    "Adjust BPM to 128",
    "Lower the bass",
    "What track is playing?",
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              AI DJ Voice Assistant
            </h1>
            <p className="text-xs text-white/40">
              Control your mix with voice commands
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ttsEnabled}
                onChange={(e) => setTtsEnabled(e.target.checked)}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
              />
              <span className="text-sm text-white/80">Text-to-Speech</span>
            </label>
            <Button
              onClick={handleStartListening}
              disabled={isListening}
              className={`${
                isListening
                  ? "bg-red-500/20 border border-red-500/50 text-red-400"
                  : "bg-primary hover:bg-primary/80 text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Voice Response */}
          {voiceResponse && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-primary">Voice Response</h2>
              </div>
              <p className="text-white">{voiceResponse}</p>
            </div>
          )}

          {/* Example Commands */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Example Commands</h2>
            <div className="grid grid-cols-2 gap-2">
              {exampleCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => handleVoiceCommand(cmd)}
                  className="p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm text-white"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2 text-white/40" />
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Command History</h2>
            {commands.length === 0 ? (
              <p className="text-sm text-white/60 text-center py-8">
                No commands yet. Start listening or try an example command above.
              </p>
            ) : (
              <div className="space-y-2">
                {commands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">"{cmd.command}"</p>
                        <p className="text-xs text-white/60 mt-1">{cmd.response}</p>
                      </div>
                      <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                        {new Date(cmd.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice-to-Prompt Generation */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Voice-to-Prompt Generation</h2>
            <p className="text-xs text-white/60 mb-4">
              Describe the mix you want, and the AI will generate a prompt for track creation.
            </p>
            <textarea
              placeholder="E.g., 'I want a dark, energetic techno track with heavy bass and atmospheric pads'"
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm mb-3"
            />
            <Button className="w-full bg-primary hover:bg-primary/80 text-white">
              Generate Prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

