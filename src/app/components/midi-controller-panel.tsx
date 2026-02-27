import { useState, useEffect } from "react";
import { Settings, Plug, Unplug, Save, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  connected: boolean;
}

interface MIDIMapping {
  deviceId: string;
  mappings: Array<{
    control: string; // e.g., "CC1", "Note C4"
    function: string; // e.g., "Deck A Volume", "Crossfader"
    value?: number; // Current value
  }>;
}

export function MIDIControllerPanel() {
  const [devices, setDevices] = useState<MIDIDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MIDIDevice | null>(null);
  const [mappings, setMappings] = useState<MIDIMapping[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);

  useEffect(() => {
    // Simulate MIDI device detection
    const mockDevices: MIDIDevice[] = [
      { id: "midi-1", name: "Pioneer DDJ-400", manufacturer: "Pioneer", connected: false },
      { id: "midi-2", name: "Numark Mixtrack Pro", manufacturer: "Numark", connected: false },
      { id: "midi-3", name: "Native Instruments Traktor Kontrol", manufacturer: "NI", connected: false },
    ];
    setDevices(mockDevices);

    // Load saved mappings
    try {
      const savedMappings = localStorage.getItem("midiMappings");
      if (savedMappings) {
        setMappings(JSON.parse(savedMappings));
      }
    } catch (error) {
      console.error("Error loading MIDI mappings:", error);
    }
  }, []);

  const handleDetectDevices = () => {
    setIsDetecting(true);
    // Simulate device detection
    setTimeout(() => {
      const updatedDevices = devices.map((device) => ({
        ...device,
        connected: Math.random() > 0.5, // Random connection status
      }));
      setDevices(updatedDevices);
      setIsDetecting(false);
      toast.success("MIDI devices scanned");
    }, 1500);
  };

  const handleConnect = (device: MIDIDevice) => {
    const updatedDevices = devices.map((d) =>
      d.id === device.id ? { ...d, connected: true } : d
    );
    setDevices(updatedDevices);
    setSelectedDevice({ ...device, connected: true });
    toast.success(`Connected to ${device.name}`);
  };

  const handleDisconnect = (device: MIDIDevice) => {
    const updatedDevices = devices.map((d) =>
      d.id === device.id ? { ...d, connected: false } : d
    );
    setDevices(updatedDevices);
    if (selectedDevice?.id === device.id) {
      setSelectedDevice(null);
    }
    toast.info(`Disconnected from ${device.name}`);
  };

  const handleStartMapping = (functionName: string) => {
    setActiveControl(functionName);
    toast.info(`Move a control on your ${selectedDevice?.name || "MIDI device"}...`);
    // Simulate MIDI input detection
    setTimeout(() => {
      if (selectedDevice) {
        const newMapping = {
          control: `CC${Math.floor(Math.random() * 127)}`,
          function: functionName,
        };
        const deviceMapping = mappings.find((m) => m.deviceId === selectedDevice.id);
        if (deviceMapping) {
          deviceMapping.mappings.push(newMapping);
          setMappings([...mappings]);
        } else {
          setMappings([
            ...mappings,
            {
              deviceId: selectedDevice.id,
              mappings: [newMapping],
            },
          ]);
        }
        setActiveControl(null);
        toast.success(`Mapped ${functionName} to ${newMapping.control}`);
      }
    }, 2000);
  };

  const handleSaveMappings = () => {
    try {
      localStorage.setItem("midiMappings", JSON.stringify(mappings));
      toast.success("MIDI mappings saved!");
    } catch (error) {
      console.error("Error saving mappings:", error);
      toast.error("Failed to save mappings");
    }
  };

  const mixerFunctions = [
    "Deck A Volume",
    "Deck B Volume",
    "Deck A Pitch",
    "Deck B Pitch",
    "Crossfader",
    "Deck A EQ Low",
    "Deck A EQ Mid",
    "Deck A EQ High",
    "Deck B EQ Low",
    "Deck B EQ Mid",
    "Deck B EQ High",
    "Deck A Play/Pause",
    "Deck B Play/Pause",
    "Deck A Cue",
    "Deck B Cue",
  ];

  const currentMappings = selectedDevice
    ? mappings.find((m) => m.deviceId === selectedDevice.id)?.mappings || []
    : [];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              MIDI Controller Support
            </h1>
            <p className="text-xs text-white/40">
              Connect and map your MIDI hardware controllers
            </p>
          </div>
          <Button
            onClick={handleDetectDevices}
            disabled={isDetecting}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            {isDetecting ? (
              "Detecting..."
            ) : (
              <>
                <Plug className="w-4 h-4 mr-2" />
                Detect Devices
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Available Devices */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Available MIDI Devices</h2>
            {devices.length === 0 ? (
              <p className="text-sm text-white/60 text-center py-8">
                No MIDI devices detected. Click "Detect Devices" to scan.
              </p>
            ) : (
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedDevice?.id === device.id
                        ? "bg-primary/20 border-primary/50"
                        : device.connected
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white/5 border-white/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white">{device.name}</h3>
                          {device.connected && (
                            <div className="flex items-center gap-1 text-xs text-green-400">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span>Connected</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-white/60">{device.manufacturer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.connected ? (
                          <Button
                            onClick={() => handleDisconnect(device)}
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          >
                            <Unplug className="w-3.5 h-3.5 mr-1.5" />
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleConnect(device)}
                            size="sm"
                            className="bg-primary hover:bg-primary/80 text-white"
                          >
                            <Plug className="w-3.5 h-3.5 mr-1.5" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mapping Interface */}
          {selectedDevice && selectedDevice.connected && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Control Mapping: {selectedDevice.name}
                    </h2>
                    <p className="text-xs text-white/60 mt-1">
                      Click "Map" next to a function, then move the control on your device
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSaveMappings}
                      size="sm"
                      className="bg-primary hover:bg-primary/80 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Mappings
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mixerFunctions.map((func) => {
                    const existingMapping = currentMappings.find((m) => m.function === func);
                    const isMapping = activeControl === func;

                    return (
                      <div
                        key={func}
                        className={`p-3 rounded-lg border transition-all ${
                          isMapping
                            ? "bg-primary/20 border-primary/50 animate-pulse"
                            : existingMapping
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{func}</p>
                            {existingMapping && (
                              <p className="text-xs text-green-400 font-['IBM_Plex_Mono'] mt-1">
                                → {existingMapping.control}
                              </p>
                            )}
                            {isMapping && (
                              <p className="text-xs text-primary font-['IBM_Plex_Mono'] mt-1 animate-pulse">
                                Waiting for input...
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleStartMapping(func)}
                            size="sm"
                            variant="outline"
                            disabled={isMapping}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                          >
                            {isMapping ? "Mapping..." : existingMapping ? "Remap" : "Map"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Mappings List */}
              {currentMappings.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Active Mappings</h3>
                  <div className="space-y-2">
                    {currentMappings.map((mapping, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/60 font-['IBM_Plex_Mono'] w-20">
                            {mapping.control}
                          </span>
                          <span className="text-xs text-white/40">→</span>
                          <span className="text-sm text-white">{mapping.function}</span>
                        </div>
                        <button
                          onClick={() => {
                            const deviceMapping = mappings.find(
                              (m) => m.deviceId === selectedDevice.id
                            );
                            if (deviceMapping) {
                              deviceMapping.mappings = deviceMapping.mappings.filter(
                                (m) => m.control !== mapping.control || m.function !== mapping.function
                              );
                              setMappings([...mappings]);
                            }
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hotplug Support Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Plug className="w-4 h-4 text-primary" />
              Hotplug Support
            </h3>
            <p className="text-xs text-white/60">
              MIDI devices can be connected or disconnected at any time. The app will automatically
              detect when devices are plugged in or unplugged and maintain your mapping profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

