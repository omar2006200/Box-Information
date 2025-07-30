import { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, delay = 50, onFinished }: { text: string; delay?: number, onFinished?: () => void }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if(onFinished) {
      onFinished();
    }
  }, [currentIndex, delay, text, onFinished]);

  return <span>{currentText}<span className="terminal-caret">_</span></span>;
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-6 animate-fade-in">
        <h2 className="text-lg mb-3 text-glow text-cyan-400">./{title}</h2>
        <div className="pl-4 border-l-2 border-green-500/20">
          {children}
        </div>
    </section>
);

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telegram"><path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4"/></svg>
);

const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let unmounted = false;

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const rainDrops: number[] = [];
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            if (unmounted || !ctx) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 33);
        
        return () => {
            unmounted = true;
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        }
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen z-0 opacity-30" />;
}


export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="relative min-h-screen bg-black">
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto p-4 md:p-8 font-mono max-w-2xl text-sm">
        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-glow">
            <Typewriter text="guest@portfolio:~$ whoami" onFinished={() => setTimeout(() => setShowContent(true), 300)} />
          </h1>
        </header>

        {showContent && (
        <main>
          <div className="space-y-8 bg-black/50 backdrop-blur-sm p-4 rounded-md border border-green-500/20">
              <Section title="about">
                  <div className="space-y-2 text-green-500/90">
                      <p><span className="text-cyan-400 font-bold">NAME</span>: BOX</p>
                      <p><span className="text-cyan-400 font-bold">LOCATION</span>: العراق, البصرة</p>
                      <p><span className="text-cyan-400 font-bold">BIO</span>: مهندس بوتات تلكرام</p>
                      <div>
                          <p className="text-cyan-400 font-bold mt-2">HOBBIES:</p>
                          <ul className="list-['>_'] list-inside pl-2 text-xs">
                              <li> تطوير البوتات</li>
                              <li> الهندسة العكسية</li>
                              <li> استكشاف واجهات برمجة التطبيقات</li>
                              <li> أمن المعلومات</li>
                          </ul>
                      </div>
                  </div>
              </Section>

              <Section title="goals">
                  <ul className="list-['>_'] list-inside space-y-1 text-green-500/90 pl-2">
                      <li>تطوير بوتات ذكاء اصطناعي متقدمة.</li>
                      <li>بناء منصة متكاملة لإنشاء البوتات.</li>
                      <li>المساهمة في مجتمع مطوري البوتات.</li>
                  </ul>
              </Section>

              <Section title="contact">
                  <div className="flex flex-wrap gap-4">
                       <a href="https://t.me/maria_kaderbot" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-cyan-400 transition-colors">
                          <TelegramIcon />
                          <span>قناة البوتات</span>
                      </a>
                  </div>
              </Section>
          </div>
        </main>
        )}
      </div>
    </div>
  );
}