import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, X, RefreshCw } from 'lucide-react';
import { getWeather } from '../services/offlineService';

const VoiceAssistant = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [response, setResponse] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isActive, setIsActive] = useState(false); // Track if user wants it ON

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    // Auto-restart listening if it stops unexpectedly (Persistent Mode)
    useEffect(() => {
        let timer;
        if (!listening && !response && !isSpeaking && !errorMessage && isActive) {
            // Short delay before restart to prevent infinite loops on legitimate stops
            timer = setTimeout(() => {
                const langMap = { 'en': 'en-US', 'te': 'te-IN', 'hi': 'hi-IN', 'ta': 'ta-IN' };
                const language = langMap[i18n.language] || 'en-US';
                SpeechRecognition.startListening({ continuous: false, language }).catch(e => console.error("Auto-restart failed", e));
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [listening, response, isSpeaking, errorMessage, i18n.language, isActive]);

    // Process transcript
    useEffect(() => {
        if (!listening && transcript && !isThinking && isActive) {
            setIsThinking(true);
            setTimeout(() => {
                processCommand(transcript);
                setIsThinking(false);
            }, 800);
        }
    }, [listening, transcript, isActive]);

    // ... existing useEffect ...

    if (!browserSupportsSpeechRecognition) return null;

    const toggleListening = () => {
        if (isActive) {
            setIsActive(false);
            SpeechRecognition.stopListening();
            resetTranscript();
            setResponse('');
        } else {
            setIsActive(true);
            resetTranscript();
            setResponse('');
            setErrorMessage('');
            const langMap = { 'en': 'en-US', 'te': 'te-IN', 'hi': 'hi-IN', 'ta': 'ta-IN' };
            const language = langMap[i18n.language] || 'en-US';
            SpeechRecognition.startListening({ continuous: false, language }).catch(err => {
                setErrorMessage("Audio capture failure");
                console.error(err);
            });
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const langMap = { 'en': 'en-US', 'te': 'te-IN', 'hi': 'hi-IN', 'ta': 'ta-IN' };
            const targetLang = langMap[i18n.language] || 'en-US';
            const voice = voices.find(v => v.lang === targetLang) || voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) || voices[0];

            if (voice) utterance.voice = voice;
            utterance.lang = targetLang;
            utterance.rate = 0.95;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = (command) => {
        const lowerCmd = command.toLowerCase();
        let reply = '';

        if (lowerCmd.includes('weather') || lowerCmd.includes('climate') || lowerCmd.includes('rain') || lowerCmd.includes('wind') || lowerCmd.includes('vatavaranam') || lowerCmd.includes('mausam') || lowerCmd.includes('vanilai')) {
            const weather = getWeather();
            if (weather) {
                reply = `Tactical Weather Report: ${weather.condition}, ${weather.temp}. Wind velocity ${weather.windSpeed} knots.`;
                navigate('/weather');
            } else {
                reply = t('sensor_offline');
            }
        } else if (lowerCmd.includes('fish') || lowerCmd.includes('catch') || lowerCmd.includes('prediction') || lowerCmd.includes('chepalu') || lowerCmd.includes('machhli') || lowerCmd.includes('meen')) {
            reply = "Calculating optimized biological scan results. Moving to prediction map.";
            navigate('/prediction');
        } else if (lowerCmd.includes('market') || lowerCmd.includes('price') || lowerCmd.includes('dhara') || lowerCmd.includes('daam')) {
            reply = "Market Analysis: Visakhapatnam Harbor is currently the highest bidder. Navigating to price board.";
            navigate('/market');
        } else if (lowerCmd.includes('sentinel') || lowerCmd.includes('radar') || lowerCmd.includes('safety') || lowerCmd.includes('collision')) {
            reply = "Sentinel Tactical HUD Active. Scanning for maritime hazards and current optimization.";
            navigate('/sentinel');
        } else if (lowerCmd.includes('stop') || lowerCmd.includes('turn off') || lowerCmd.includes('deactivate') || lowerCmd.includes('quiet') || lowerCmd.includes('aapeyi')) {
            reply = "Deactivating tactical voice assistance. VOX offline.";
            setTimeout(() => {
                setIsActive(false);
                SpeechRecognition.stopListening();
            }, 2000);
        } else if (lowerCmd.includes('help') || lowerCmd.includes('sos') || lowerCmd.includes('emergency')) {
            reply = "Emergency Signal Prime. Broadcasting your location to local vessel networks.";
        } else {
            reply = t('command_not_found');
        }

        setResponse(reply);
        speak(reply);
    };

    return (
        <div className="fixed bottom-6 left-6 z-[3000] flex flex-col items-start pointer-events-none">
            {/* Tactical Feedback Bubble */}
            {(transcript || response || isThinking || errorMessage) && (
                <div className="mb-4 p-5 bg-[#020617]/95 backdrop-blur-2xl border border-aqua-glow/40 rounded-[32px] max-w-xs shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white pointer-events-auto animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center mb-4 gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-aqua-glow shadow-[0_0_10px_#0ea5e9]'} animate-pulse`} />
                            <span className="text-[10px] text-aqua-glow font-black uppercase tracking-[0.2em] italic">AQUANOVA VOX</span>
                        </div>
                        <button onClick={() => { resetTranscript(); setResponse(''); setErrorMessage(''); setIsThinking(false); }} className="text-white/20 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                    </div>

                    {isThinking ? (
                        <div className="flex flex-col gap-2 py-2">
                            <div className="flex gap-1 justify-center">
                                <span className="w-1.5 h-1.5 bg-aqua-glow rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-aqua-glow rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-aqua-glow rounded-full animate-bounce"></span>
                            </div>
                            <p className="text-[10px] text-center font-black text-blue-400 uppercase tracking-widest">Processing Tactical Data</p>
                        </div>
                    ) : (
                        <>
                            {errorMessage ? (
                                <p className="text-red-400 text-xs font-black uppercase border-l-2 border-red-500 pl-3 py-1 bg-red-500/10 rounded-r-lg">{errorMessage}</p>
                            ) : (
                                <>
                                    {transcript && <p className="text-blue-200 italic mb-3 border-l-2 border-aqua-glow/50 pl-3 py-2 text-sm bg-blue-950/30 rounded-r-xl font-medium">"{transcript}"</p>}
                                    {response && <p className="text-white font-black text-sm tracking-tight leading-relaxed animate-in fade-in zoom-in duration-300">{response}</p>}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Tactical Command Pulse */}
            <button
                onClick={toggleListening}
                className={`group pointer-events-auto relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 transform hover:scale-110 active:scale-90 border-2 overflow-hidden ${listening
                    ? 'bg-red-600 border-red-400 shadow-red-500/40'
                    : isSpeaking
                        ? 'bg-emerald-600 border-emerald-400 shadow-emerald-500/40'
                        : 'bg-[#020617] border-aqua-glow shadow-aqua-glow/40'
                    }`}
            >
                {/* Background Animation */}
                {!listening && !isSpeaking && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-aqua-glow opacity-80 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="relative z-10">
                    {listening ? (
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-6 bg-white rounded-full animate-[pulse_1s_infinite]" />
                            <div className="w-1 h-10 bg-white rounded-full animate-[pulse_1s_infinite_200ms]" />
                            <div className="w-1 h-6 bg-white rounded-full animate-[pulse_1s_infinite_400ms]" />
                        </div>
                    ) : isSpeaking ? (
                        <Volume2 className="w-10 h-10 text-white animate-bounce" />
                    ) : (
                        <MicOff className="w-10 h-10 text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    )}
                </div>

                {/* Inner Glow */}
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-700" />
            </button>

            {!isMicrophoneAvailable && (
                <div className="bg-red-600/90 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mt-4 shadow-2xl border border-red-400/50 animate-bounce">
                    SENSORY SATELLITE DISCONNECTED
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
