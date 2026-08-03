'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Send,
  MessageSquare,
  TrendingUp,
  PieChart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Pause,
  Play,
  ShieldCheck,
  Zap,
  BarChart3,
  Webhook,
  MessageCircle,
  Check,
  Code2,
  Building2,
  Briefcase,
  Scale,
  Headphones,
  Megaphone,
  GraduationCap,
  ShoppingBag,
  RefreshCw,
  Activity,
  Shield,
  Lock,
  Server,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react';

const PLANOS = [
  { nome: 'Essencial', faixa: [1, 4], preco: 97 },
  { nome: 'Padrão', faixa: [5, 10], preco: 87 },
  { nome: 'Profissional', faixa: [11, 20], preco: 77 },
  { nome: 'Avançado', faixa: [21, 50], preco: 67 },
  { nome: 'Business', faixa: [51, 100], preco: 57 },
  { nome: 'Corporativo', faixa: [101, Infinity], preco: 47 }
];

const screenshots = [
  {
    index: 0,
    title: 'Gestão de Contatos',
    desc: 'Organize todos os seus devedores com filtros por carteira, etiquetas e ações em massa.',
    image: '/screenshots/screen-contatos.png',
    badge: 'Gestão de carteira',
    icon: <Users size={16} />
  },
  {
    index: 1,
    title: 'Disparo em Massa',
    desc: 'Envie mensagens personalizadas com templates e variáveis para milhares de contatos.',
    image: '/screenshots/screen-disparo.png',
    badge: 'Disparo em massa',
    icon: <Send size={16} />
  },
  {
    index: 2,
    title: 'Central de Atendimento',
    desc: 'Gerencie tickets, converse em tempo real e acompanhe todo o histórico de interações.',
    image: '/screenshots/screen-chat.png',
    badge: 'Multi-agente',
    icon: <MessageSquare size={16} />
  },
  {
    index: 3,
    title: 'Dashboard de Métricas',
    desc: 'Acompanhe KPIs, desempenho da equipe e evolução dos atendimentos em tempo real.',
    image: '/screenshots/screen-dashboard.png',
    badge: 'KPI por operador',
    icon: <TrendingUp size={16} />
  },
  {
    index: 4,
    title: 'Painel de Controle',
    desc: 'Visualize dados por fila, usuário, status e canal com gráficos interativos.',
    image: '/screenshots/screen-painel.png',
    badge: 'Relatórios',
    icon: <PieChart size={16} />
  }
];

const FAQS = [
  {
    q: 'Preciso trocar meu sistema de cobrança pra usar o CobZap?',
    a: 'Não. O CobZap conecta ao sistema que você já usa, seja Cobmais, CPJ Cobrança ou outro com API aberta, via API REST e Webhooks. Ele entra como a camada de WhatsApp, não como substituto.'
  },
  {
    q: 'O CobZap substitui o Cobmais ou o CPJ Cobrança?',
    a: 'Não. Esses sistemas cuidam do cálculo financeiro, régua própria e gestão de carteira. O CobZap cuida do atendimento, disparo em massa e automação dentro do WhatsApp. Um convive com o outro.'
  },
  {
    q: 'Qual o risco real de bloqueio do WhatsApp em cobrança?',
    a: 'Existe, principalmente via WhatsApp Web sem boas práticas de cadência e relevância. A API Oficial da Meta, por ser homologada, reduz esse risco de forma significativa. Mostramos o comparativo completo antes de você escolher o canal.'
  },
  {
    q: 'API Oficial da Meta ou WhatsApp Web: qual devo escolher?',
    a: 'Depende do tamanho e do risco que sua operação pode assumir. API Oficial custa mais por conversa mas reduz risco de bloqueio. WhatsApp Web custa menos mas depende do celular ligado e exige mais cuidado de cadência.'
  },
  {
    q: 'O que é WABA e por que preciso dela pra usar API Oficial?',
    a: 'WABA é a conta comercial homologada pela Meta pra usar a API Oficial do WhatsApp. O CobZap conduz o processo de habilitação, você não precisa entender de configuração técnica pra ter o número aprovado.'
  },
  {
    q: 'Quanto custa o CobZap?',
    a: 'Escalonado por faixa de usuário: de R$97/usuário/mês (1 a 4 usuários) a R$47/usuário/mês (101+ usuários). Custo adicional de número: R$47/mês (WhatsApp Web) ou R$97/mês (API Oficial), mais tarifa por conversa da Meta quando aplicável. Use o simulador acima pra calcular seu custo exato.'
  },
  {
    q: 'O CobZap gera boleto ou PIX?',
    a: 'Não. O CobZap insere no WhatsApp o link que seu sistema já gera (boleto, PIX, ou outro), via variável dinâmica. Ele não calcula juros e multa, não concilia pagamento, não substitui o sistema financeiro que você já usa.'
  },
  {
    q: 'Posso integrar o CobZap com meu ERP ou CRM?',
    a: 'Sim, via API REST e Webhooks, com token por conta. Também suporta n8n, Typebot, Dify e outras ferramentas de automação. Toda integração é feita sob demanda, não existe integração nativa pronta com sistemas específicos hoje.'
  },
  {
    q: 'Quanto tempo leva pra implementar?',
    a: 'Geralmente de 1 a 3 dias úteis, com onboarding assistido: configuração do número, integração com seu sistema e treinamento da equipe.'
  },
  {
    q: 'Vocês têm algum case de cliente com resultado publicado?',
    a: 'Ainda não temos um case publicado com nome e autorização de uso. Hoje 10 clientes recorrentes usam o CobZap diariamente, com mais de 20 mil mensagens tratadas por mês na plataforma. Assim que tivermos autorização de um cliente, publicamos aqui com número real.'
  }
];

export default function Home() {
  // --- Estados do Gate Overlay ---
  const [showGate, setShowGate] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cargo: '',
    tamanho_time: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  // --- Estados do Hamburger e UI ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // --- Estados do Simulador ---
  const [simUsuarios, setSimUsuarios] = useState(5);
  const [simWeb, setSimWeb] = useState(1);
  const [simOficial, setSimOficial] = useState(0);
  const [simVolume, setSimVolume] = useState(1000);
  const [simTipo, setSimTipo] = useState('utilidade');

  // --- Estados do Carrossel de Screenshots ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayTimerRef = useRef(null);
  const touchStartXRef = useRef(0);

  // --- Contexto do WhatsApp (segmento do gate, se já preenchido) ---
  const [waContext, setWaContext] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('cobchat-gate');
    if (!stored) return;
    try {
      const data = JSON.parse(stored);
      if (data.cargo) {
        setWaContext(` Sou ${data.cargo.toLowerCase()}.`);
        localStorage.setItem('cobchat-gate', JSON.stringify({ cargo: data.cargo }));
      }
    } catch {
      localStorage.removeItem('cobchat-gate');
    }
  }, []);

  // --- Efeito Inicial: Controlar Exibição do Gate ---
  useEffect(() => {
    const hasSubmitted = !!localStorage.getItem('cobchat-gate');
    const hasSeenGateThisSession = sessionStorage.getItem('cobchat-gate-session') === '1';

    if (!hasSubmitted && !hasSeenGateThisSession) {
      setShowGate(true);
      sessionStorage.setItem('cobchat-gate-session', '1');
    }
  }, []);

  // --- Formatar Telefone do Gate ---
  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    const ddd = digits.slice(0, 2);
    const prefix = digits.slice(2, 7);
    const suffix = digits.slice(7, 11);
    if (digits.length <= 2) return `(${ddd}`;
    if (digits.length <= 7) return `(${ddd}) ${prefix}`;
    return `(${ddd}) ${prefix}-${suffix}`;
  };

  const handlePhoneChange = (e) => {
    setFormData({ ...formData, [e.target.name]: formatPhone(e.target.value) });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Revelar seções ao rolar (motion, respeita prefers-reduced-motion) ---
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.reveal');
    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- Tecla Escape para Fechar o Gate ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowGate(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Validação e Envio do Gate ---
  const handleGateSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: 'Enviando...', type: '' });
    setSubmitting(true);

    const errors = {};
    if (!formData.nome.trim()) errors.nome = 'Informe seu nome';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.email = 'E-mail inválido';
    const digits = formData.telefone.replace(/\D/g, '');
    if (digits.length < 10) errors.telefone = 'Telefone incompleto';
    if (!formData.cargo) errors.cargo = 'Selecione um cargo';
    if (!formData.tamanho_time) errors.tamanho_time = 'Selecione o tamanho';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFeedback({ message: '', type: '' });
      setSubmitting(false);
      return;
    }

    setFormErrors({});

    try {
      const payload = {
        nome: formData.nome.trim(),
        telefone: digits,
        telefone_formatado: formData.telefone,
        email: formData.email.trim(),
        cargo: formData.cargo,
        tamanho_time: formData.tamanho_time,
        website: e.target?.website?.value || ''
      };

      const response = await fetch('/api/salvar_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erro ao salvar os dados.');
      }

      setFeedback({ message: 'Dados enviados com sucesso!', type: 'success' });
      localStorage.setItem('cobchat-gate', JSON.stringify({ cargo: formData.cargo }));
      
      setTimeout(() => {
        setShowGate(false);
      }, 1000);

    } catch (error) {
      console.error('Envio do lead falhou:', error);
      setFeedback({ message: error.message || 'Erro inesperado.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // --- Scroll Suave de Âncoras do Navbar ---
  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Link de WhatsApp por seção, com UTM e contexto do gate ---
  const buildWaLink = (section, intro) => {
    const text = `Olá, vim pelo site.\n\n${intro}${waContext}`;
    const params = new URLSearchParams({ phone: '5541995491030', text });
    return `https://api.whatsapp.com/send?${params.toString()}&utm_source=site&utm_content=${section}`;
  };

  // --- Pula pro simulador com um número de usuários pré-definido ---
  const jumpToSimulator = (usuarios) => {
    setSimUsuarios(usuarios);
    const target = document.getElementById('simulador');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- Cálculos do Simulador (Reativos) ---
  const formatMoney = (n) => `R$ ${n.toFixed(2).replace('.', ',')}`;

  const calcPlano = () => {
    const usuarios = Math.max(0, parseInt(simUsuarios || '0', 10));
    const web = Math.max(0, parseInt(simWeb || '0', 10));
    const oficial = Math.max(0, parseInt(simOficial || '0', 10));
    const volume = Math.max(0, parseInt(simVolume || '0', 10));

    const plano = PLANOS.find((p) => usuarios >= p.faixa[0] && usuarios <= p.faixa[1]) || PLANOS[PLANOS.length - 1];
    const licencas = usuarios * (plano ? plano.preco : 0);
    const custoWeb = web * 47;
    const custoOficial = oficial * 97;
    const custoMsg = volume * (simTipo === 'marketing' ? 0.47 : 0.12);
    const total = licencas + custoWeb + custoOficial + custoMsg;

    return {
      plano: plano ? `${plano.nome} (${plano.faixa[0]}${plano.faixa[1] === Infinity ? '+' : ' a ' + plano.faixa[1]} usuários)` : '—',
      licencas: formatMoney(licencas),
      custoWeb: formatMoney(custoWeb),
      custoOficial: formatMoney(custoOficial),
      custoMsg: formatMoney(custoMsg),
      total: formatMoney(total)
    };
  };

  const simResult = calcPlano();

  // --- FAQ Accordion ---
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // --- Carrossel de Screenshots (Autoplay & Teclado) ---
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  // Reset progress bar e inicia o cronômetro do Autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoplayTimerRef.current = setInterval(nextSlide, 5000);
    } else {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide]);

  // Teclado para carrossel quando visível
  useEffect(() => {
    const handleKeyDown = (e) => {
      const showcase = document.getElementById('showcase');
      if (showcase) {
        const rect = showcase.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          if (e.key === 'ArrowLeft') {
            prevSlide();
          } else if (e.key === 'ArrowRight') {
            nextSlide();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Eventos de swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartXRef.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <>
      {/* HEADER NAVBAR */}
      <header className="navbar">
        <div className="container">
          <div className="brand">
            <a href="/" onClick={(e) => handleNavLinkClick(e, 'hero')} aria-label="Voltar para a página inicial">
              <img src="/logo.png" alt="CobZap, plataforma de WhatsApp para cobrança" width="76" height="50" style={{ height: '50px', width: 'auto' }} />
            </a>
          </div>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links" aria-label="Menu principal">
            <a href="#hero" onClick={(e) => handleNavLinkClick(e, 'hero')}>Início</a>
            <a href="#sobre-cobzap" onClick={(e) => handleNavLinkClick(e, 'sobre-cobzap')}>O que é</a>
            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')}>Como funciona</a>
            <a href="#showcase" onClick={(e) => handleNavLinkClick(e, 'showcase')}>Plataforma</a>
            <a href="#pricing" onClick={(e) => handleNavLinkClick(e, 'pricing')}>Planos</a>
          </nav>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            id="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="nav-links"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* GATE OVERLAY MODAL */}
      {showGate && (
        <div id="gate-overlay" className="gate-overlay open">
          <div className="gate-card">
            <div className="gate-head">
              <p className="eyebrow">Antes de acessar</p>
              <h2>Preencha os dados para continuar</h2>
              <p className="muted">Usaremos essas informações para personalizar sua experiência.</p>
            </div>
            <form id="gate-form" className="form-grid" onSubmit={handleGateSubmit} noValidate>
              {/* Honeypot anti-bot: invisível para humanos, ignorado por leitores de tela */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
              />
              <div className="form-field">
                <label htmlFor="gate-nome">Qual é seu nome? <span>*</span></label>
                <input
                  type="text"
                  id="gate-nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Ana Souza"
                  required
                />
                {formErrors.nome && <small data-error-for="gate-nome" style={{ display: 'block' }}>{formErrors.nome}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="gate-telefone">Qual é seu telefone/WhatsApp? <span>*</span></label>
                <input
                  type="tel"
                  id="gate-telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  required
                />
                {formErrors.telefone && <small data-error-for="gate-telefone" style={{ display: 'block' }}>{formErrors.telefone}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="gate-email">Qual é seu e-mail? <span>*</span></label>
                <input
                  type="email"
                  id="gate-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@empresa.com"
                  required
                />
                {formErrors.email && <small data-error-for="gate-email" style={{ display: 'block' }}>{formErrors.email}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="gate-cargo">Qual é seu cargo? <span>*</span></label>
                <select id="gate-cargo" name="cargo" value={formData.cargo} onChange={handleInputChange} required>
                  <option value="">Selecione</option>
                  <option value="Sócio Proprietário">Sócio Proprietário</option>
                  <option value="Diretor">Diretor</option>
                  <option value="Superintendente">Superintendente</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Analista">Analista</option>
                  <option value="Outro">Outro</option>
                </select>
                {formErrors.cargo && <small data-error-for="gate-cargo" style={{ display: 'block' }}>{formErrors.cargo}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="gate-time">Qual é o tamanho do seu time? <span>*</span></label>
                <select id="gate-time" name="tamanho_time" value={formData.tamanho_time} onChange={handleInputChange} required>
                  <option value="">Selecione</option>
                  <option value="1 a 5">De 1 a 5</option>
                  <option value="5 a 10">De 5 a 10</option>
                  <option value="10 a 20">De 10 a 20</option>
                  <option value="20 a 50">De 20 a 50</option>
                  <option value="50 a 100">De 50 a 100</option>
                  <option value="100+">Acima de 100</option>
                </select>
                {formErrors.tamanho_time && <small data-error-for="gate-time" style={{ display: 'block' }}>{formErrors.tamanho_time}</small>}
              </div>

              {feedback.message && (
                <div id="gate-feedback" className={`feedback ${feedback.type}`} role="status" aria-live="polite">
                  {feedback.message}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="solid-btn full" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Acessar página'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main>
        {/* HERO SECTION */}
        <section id="hero" className="hero">
          <div className="container">
            <div className="hero-copy hero-copy-centered reveal">
              <div className="pill">Atendimento, disparo em massa e automação · conectado ao seu sistema atual</div>
              <h1>A camada de WhatsApp da sua operação de cobrança. Conectada ao sistema que você já tem.</h1>
              <p>Atendimento multiagente, disparo em massa e régua automatizada, via API Oficial da Meta ou WhatsApp Web. Sem substituir o CRM ou sistema de cobrança que você já usa.</p>
              <div className="cta-row">
                <a
                  className="solid-btn"
                  href="#sobre-cobzap"
                  onClick={(e) => handleNavLinkClick(e, 'sobre-cobzap')}
                >
                  Ver como funciona a integração
                </a>
                <a
                  className="ghost-btn"
                  href={buildWaLink('hero', 'Quero falar com um especialista sobre o CobZap.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com especialista
                </a>
              </div>
              <div className="hero-stats">
                <div>
                  <span className="stat-number">+20 mil</span>
                  <span className="stat-label">Mensagens tratadas por mês</span>
                </div>
                <div>
                  <span className="stat-number">10</span>
                  <span className="stat-label">Operações de cobrança ativas</span>
                </div>
                <div>
                  <span className="stat-number">1–3 dias</span>
                  <span className="stat-label">Tempo de implementação</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE CONTEÚDO DENSO */}
        <section id="sobre-cobzap" className="sobre-section" aria-label="O que é o CobZap">
          <div className="container">
            <div className="sobre-grid reveal">
              <div className="sobre-text">
                <h2>O que é o CobZap?</h2>
                <p>
                  CobZap é uma <strong>plataforma de WhatsApp para operações de cobrança</strong>: atendimento multiagente, disparo em massa e régua automatizada, conectados à <strong>API Oficial da Meta (WhatsApp Business Cloud API)</strong> ou ao WhatsApp Web.
                </p>
                <p>
                  O CobZap não substitui o sistema de cobrança que você já usa. Se sua operação roda no <strong>Cobmais</strong>, no <strong>CPJ Cobrança</strong>, ou em qualquer outro sistema com API aberta, o CobZap entra como a camada de WhatsApp: conecta via <strong>API REST e Webhooks</strong>, sem trocar o que já funciona.
                </p>
                <p>
                  Assessorias de cobrança, escritórios de advocacia, call centers, operações de telemarketing e empresas que cobram os próprios clientes usam o CobZap pra centralizar atendimento, disparar cobrança em massa com variáveis dinâmicas (nome, valor da dívida, link de pagamento) e automatizar a régua por data e horário. Os planos vão de <strong>R$47 a R$97 por usuário/mês</strong>, escalonados pelo tamanho da operação.
                </p>
              </div>
              <div className="sobre-metricas">
                <div className="sobre-metrica">
                  <strong>+20 mil</strong>
                  <span>mensagens tratadas por mês na plataforma</span>
                </div>
                <div className="sobre-metrica">
                  <strong>10</strong>
                  <span>operações de cobrança ativas na plataforma hoje</span>
                </div>
                <div className="sobre-metrica">
                  <strong>1–3 dias</strong>
                  <span>tempo de implementação com onboarding completo</span>
                </div>
                <div className="sobre-metrica">
                  <strong>API + Webhooks</strong>
                  <span>integração com o sistema que você já usa, sem substituí-lo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OS TRÊS JOBS */}
        <section id="features" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Os três jobs</p>
              <h2>Atendimento, disparo em massa e automação. Tudo em WhatsApp.</h2>
              <p className="lead">Cada job resolve uma parte específica da operação de cobrança, não é WhatsApp genérico com nome novo.</p>
            </div>
            <div className="card-grid reveal">
              <article className="card">
                <div className="card-icon"><MessageCircle size={24} /></div>
                <h3>Atendimento</h3>
                <p>Central multiagente com fila e ticket por carteira. Histórico completo, mesmo se o atendente sair da empresa.</p>
              </article>
              <article className="card">
                <div className="card-icon"><Send size={24} /></div>
                <h3>Disparo em massa</h3>
                <p>Envie cobrança pra milhares de contatos com variável de nome, valor da dívida e link de pagamento, gerado pelo seu sistema.</p>
              </article>
              <article className="card">
                <div className="card-icon"><RefreshCw size={24} /></div>
                <h3>Automação</h3>
                <p>Régua de cobrança programada por data e horário. Sequência automática, sem depender de alguém lembrar de mandar a próxima mensagem.</p>
              </article>
            </div>
            <div className="cta-row">
              <a
                className="solid-btn"
                href={buildWaLink('jobs', 'Quero saber mais sobre atendimento, disparo em massa e automação.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Começar agora
              </a>
              <a
                className="ghost-btn"
                href={buildWaLink('jobs', 'Quero falar com um especialista sobre o CobZap.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com especialista
              </a>
            </div>
          </div>
        </section>

        {/* SCREENSHOT CAROUSEL */}
        <section id="showcase" className="product-showcase">
          <div className="container">
            <div className="showcase-header reveal">
              <span className="eyebrow">Veja na Prática</span>
              <h2>Conheça a plataforma por dentro</h2>
              <p className="lead">Uma interface moderna e intuitiva projetada para maximizar sua produtividade em cobrança.</p>
            </div>

            <div
              className="screenshot-carousel"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="carousel-viewport">
                <div className="carousel-stage" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
                  {screenshots.map((slide) => (
                    <div className="screenshot-slide" key={slide.index} data-slide={slide.index}>
                      <div className="screenshot-frame">
                        <div className="browser-bar">
                          <div className="browser-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span className="browser-title">CobZap - {slide.title}</span>
                        </div>
                        <div className="screenshot-image-wrapper">
                          <img src={slide.image} alt={`Tela de ${slide.title} do CobZap`} loading="lazy" />
                        </div>
                        <div className="slide-info">
                          <div className="slide-info-content">
                            <h3>{slide.title}</h3>
                            <p>{slide.desc}</p>
                          </div>
                          <span className="slide-badge">
                            {slide.icon} {slide.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles do Carrossel */}
              <div className="carousel-nav">
                <button className="carousel-nav-btn prev-btn" onClick={prevSlide} aria-label="Slide anterior" disabled={currentSlide === 0}>
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-nav-btn next-btn" onClick={nextSlide} aria-label="Próximo slide" disabled={currentSlide === screenshots.length - 1}>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Indicadores do Carrossel */}
            <div className="carousel-indicators">
              {screenshots.map((slide) => (
                <button
                  key={slide.index}
                  className={`carousel-indicator ${currentSlide === slide.index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(slide.index)}
                  aria-label={`Ir para slide ${slide.index + 1}`}
                ></button>
              ))}
            </div>

            {/* Indicador de Autoplay */}
            <div className="autoplay-indicator">
              <button className="play-pause-btn" onClick={() => setIsAutoPlaying(!isAutoPlaying)} aria-label={isAutoPlaying ? 'Pausar Autoplay' : 'Iniciar Autoplay'}>
                {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: isAutoPlaying ? '100%' : '0%',
                    transition: isAutoPlaying ? 'width 5000ms linear' : 'none'
                  }}
                  key={`${currentSlide}-${isAutoPlaying}`}
                ></div>
              </div>
              <span>Automático</span>
            </div>

            {/* Feature Tags */}
            <div className="feature-tags">
              <div className="feature-tag"><ShieldCheck size={16} /> WhatsApp Oficial</div>
              <div className="feature-tag"><Zap size={16} /> Mensagens Ilimitadas</div>
              <div className="feature-tag"><Users size={16} /> Multi-atendentes</div>
              <div className="feature-tag"><BarChart3 size={16} /> Relatórios Avançados</div>
              <div className="feature-tag"><Webhook size={16} /> API & Webhooks</div>
            </div>
          </div>
        </section>

        {/* API WHATSAPP SECTION */}
        <section id="api-whatsapp" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Tecnologia & API</p>
              <h2>Duas formas de conectar. Comparamos antes de você decidir.</h2>
              <p className="lead">Envio em massa por WhatsApp Web sem boas práticas de cadência tem risco real de bloqueio. A API Oficial da Meta é homologada e reduz esse risco de forma significativa, mas custa mais por conversa. Veja o comparativo completo antes de escolher.</p>
            </div>
            <div className="api-grid reveal">
              <div className="api-text-block">
                <h3>O que é a API de WhatsApp para cobrança do CobZap?</h3>
                <p>A <strong>API de WhatsApp</strong> do CobZap conecta seu sistema à API Oficial da Meta ou ao WhatsApp Web, especificamente configurada para atendimento, disparo em massa e automação de cobrança. Nossa API REST se integra facilmente a qualquer ERP, CRM ou banco de dados, permitindo disparos em massa automáticos e em tempo real.</p>

                <div className="api-features-list">
                  <div className="api-feature-item">
                    <Code2 size={32} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div>
                      <h4>API REST e Webhooks completos</h4>
                      <p>Envie dados de cobrança e receba respostas de status de entrega, leitura e mensagens recebidas de volta no seu sistema.</p>
                    </div>
                  </div>
                  <div className="api-feature-item">
                    <Zap size={32} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div>
                      <h4>Disparos instantâneos e em lote</h4>
                      <p>Envie notificações automáticas individuais ou execute campanhas de cobrança em massa para milhares de clientes devedores de forma estável.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="api-table-wrapper">
                <h3>Duas formas de conectar seu WhatsApp</h3>
                <p className="muted">Escolha a conexão que melhor se adapta ao tamanho e necessidade da sua operação de cobrança.</p>
                <table className="api-comparison-table">
                  <thead>
                    <tr>
                      <th>Recurso</th>
                      <th>API Oficial (Meta)</th>
                      <th>Conexão Web (QR Code)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Risco de Bloqueio</strong></td>
                      <td>Baixo (canal homologado)</td>
                      <td>Existe, aumenta sem boas práticas de cadência</td>
                    </tr>
                    <tr>
                      <td><strong>Depende do celular ligado</strong></td>
                      <td>Não</td>
                      <td>Sim</td>
                    </tr>
                    <tr>
                      <td><strong>Mensagens/Segundo</strong></td>
                      <td>Ilimitadas (Alta vazão)</td>
                      <td>Limitadas (Cadenciadas)</td>
                    </tr>
                    <tr>
                      <td><strong>Custo por Conversa</strong></td>
                      <td>Sim (Tarifa da Meta)</td>
                      <td>Grátis (Mensagens ilimitadas)</td>
                    </tr>
                    <tr>
                      <td><strong>Indicado para</strong></td>
                      <td>Grandes operações e marcas</td>
                      <td>Pequenas e médias carteiras</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SEGMENTOS SECTION */}
        <section id="segmentos" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Para quem é</p>
              <h2>Feito para quem cobra. Escritório, assessoria, ou operação própria.</h2>
              <p className="lead">Feito para quem vive de cobrança, e para quem precisa cobrar sem sair do seu negócio.</p>
            </div>

            {/* Grupo primário */}
            <div className="segmentos-group-label">
              <Building2 size={20} />
              <span>Para empresas especializadas em cobrança</span>
            </div>
            <div className="segmentos-grid segmentos-primary">
              <div className="segmento-card primary">
                <div className="segmento-icon"><Briefcase size={24} /></div>
                <h3>Assessorias de Cobrança</h3>
                <p>Gerencie múltiplas carteiras de diferentes credores em um painel centralizado, com réguas, templates e relatórios de desempenho separados por cliente ou carteira.</p>
                <ul>
                  <li><Check size={14} /> Múltiplas carteiras por credor</li>
                  <li><Check size={14} /> Relatórios individuais por cliente</li>
                  <li><Check size={14} /> Réguas segmentadas por perfil</li>
                </ul>
              </div>

              <div className="segmento-card primary">
                <div className="segmento-icon"><Scale size={24} /></div>
                <h3>Escritórios de Advocacia</h3>
                <p>Gestão de carteira por processo, comunicação alinhada ao CDC e histórico auditável. Automatize a régua amigável antes do processo judicial.</p>
                <ul>
                  <li><Check size={14} /> Régua pré-jurídica automatizada</li>
                  <li><Check size={14} /> Acordos e parcelamentos via chat</li>
                  <li><Check size={14} /> Histórico completo e auditável</li>
                </ul>
              </div>

              <div className="segmento-card primary">
                <div className="segmento-icon"><Headphones size={24} /></div>
                <h3>Call Centers de Cobrança</h3>
                <p>Escale sua operação com dezenas de atendentes simultâneos, filas inteligentes, supervisão em tempo real e métricas individuais por operador.</p>
                <ul>
                  <li><Check size={14} /> Filas e distribuição automática</li>
                  <li><Check size={14} /> Dashboard por operador</li>
                  <li><Check size={14} /> Supervisão e monitoramento ao vivo</li>
                </ul>
              </div>

              <div className="segmento-card primary">
                <div className="segmento-icon"><Megaphone size={24} /></div>
                <h3>Telemarketing & Recuperação Ativa</h3>
                <p>Dispare campanhas ativas em massa, personalize a abordagem por perfil de devedor e acompanhe a taxa de retorno em tempo real para ajustar a estratégia.</p>
                <ul>
                  <li><Check size={14} /> Disparo em massa personalizado</li>
                  <li><Check size={14} /> Segmentação por perfil de dívida</li>
                  <li><Check size={14} /> Taxa de resposta em tempo real</li>
                </ul>
              </div>
            </div>

            {/* Divisor */}
            <div className="segmentos-divider">
              <span>E também para quem cobra diretamente dos seus clientes</span>
            </div>

            {/* Grupo secundário */}
            <div className="segmentos-grid">
              <div className="segmento-card">
                <div className="segmento-icon"><GraduationCap size={24} /></div>
                <h3>Instituições de Ensino</h3>
                <p>Reduza a inadimplência escolar automatizando a régua de mensalidades, taxas de rematrícula e negociações de acordo de forma discreta e amigável.</p>
                <ul>
                  <li><Check size={14} /> Mensalidades atrasadas</li>
                  <li><Check size={14} /> Acordos de renegociação</li>
                  <li><Check size={14} /> Lembretes pré-vencimento</li>
                </ul>
              </div>

              <div className="segmento-card">
                <div className="segmento-icon"><ShoppingBag size={24} /></div>
                <h3>Varejo & E-commerce</h3>
                <p>Cobre crediários (carnês) e vendas em aberto com lembretes automáticos, inserindo no WhatsApp o link de boleto ou PIX que seu sistema já gera.</p>
                <ul>
                  <li><Check size={14} /> Boletos e PIX pendentes</li>
                  <li><Check size={14} /> Lembretes de crediário/carnê</li>
                  <li><Check size={14} /> Links de pagamento direto</li>
                </ul>
              </div>

              <div className="segmento-card">
                <div className="segmento-icon"><RefreshCw size={24} /></div>
                <h3>SaaS & Provedores de Internet</h3>
                <p>Mantenha sua receita recorrente sob controle com réguas automatizadas para assinaturas e serviços de banda larga expirados ou inadimplentes.</p>
                <ul>
                  <li><Check size={14} /> Faturas mensais e assinaturas</li>
                  <li><Check size={14} /> Avisos de bloqueio automático</li>
                  <li><Check size={14} /> Links seguros de pagamento</li>
                </ul>
              </div>

              <div className="segmento-card">
                <div className="segmento-icon"><Activity size={24} /></div>
                <h3>Clínicas & Prestadores de Serviço</h3>
                <p>Simplifique a cobrança de consultas, coparticipações e serviços prestados com comunicação rápida, profissional e integrada ao seu sistema.</p>
                <ul>
                  <li><Check size={14} /> Cobrança de coparticipação</li>
                  <li><Check size={14} /> Faturas vencidas e lembretes</li>
                  <li><Check size={14} /> Envio automático de recibos/NFs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="section inverted">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Planos</p>
              <h2>Você já viu o que o CobZap faz. Aqui está quanto custa.</h2>
              <p className="lead">Escolha o tamanho do seu time e simule o valor exato pra sua operação.</p>
            </div>
            <div className="card-grid reveal">
              <button className="card" type="button" onClick={() => jumpToSimulator(10)}>
                <div className="card-icon"><Users size={24} /></div>
                <h3>Times pequenos</h3>
                <p>1 a 20 usuários, a partir de R$77/usuário/mês. Simular meu custo exato.</p>
              </button>
              <button className="card" type="button" onClick={() => jumpToSimulator(50)}>
                <div className="card-icon"><Users size={24} /></div>
                <h3>Times médios</h3>
                <p>21 a 100 usuários, a partir de R$57/usuário/mês. Simular meu custo exato.</p>
              </button>
              <button className="card" type="button" onClick={() => jumpToSimulator(120)}>
                <div className="card-icon"><Users size={24} /></div>
                <h3>Times grandes</h3>
                <p>101+ usuários, a partir de R$47/usuário/mês. Simular meu custo exato.</p>
              </button>
            </div>
          </div>
        </section>

        {/* SIMULADOR SECTION */}
        <section id="simulador" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Simulador</p>
              <h2>Calcule seu custo mensal</h2>
              <p className="lead">Informe usuários, números e volume de mensagens para ver o valor estimado. Sem letra miúda, o valor que aparece aqui é o valor que vem na fatura.</p>
              <div className="cta-row">
                <a
                  className="solid-btn"
                  href={buildWaLink('simulador', `Simulei ${simResult.total}/mês pra ${simUsuarios} usuários no site, quero falar com especialista.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com especialista
                </a>
              </div>
            </div>
            <div className="sim-grid">
              <div className="sim-card">
                <div className="form-field">
                  <label htmlFor="sim-usuarios">Quantidade de usuários</label>
                  <input type="number" id="sim-usuarios" min="1" value={simUsuarios} onChange={(e) => setSimUsuarios(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="sim-web">Números WhatsApp Web</label>
                  <input type="number" id="sim-web" min="0" value={simWeb} onChange={(e) => setSimWeb(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="sim-oficial">Números API Oficial</label>
                  <input type="number" id="sim-oficial" min="0" value={simOficial} onChange={(e) => setSimOficial(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="sim-volume">Volume de mensagens</label>
                  <input type="number" id="sim-volume" min="0" value={simVolume} onChange={(e) => setSimVolume(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="sim-tipo">Tipo de mensagem</label>
                  <select id="sim-tipo" value={simTipo} onChange={(e) => setSimTipo(e.target.value)}>
                    <option value="utilidade">Utilidade (conversa 24h)</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div className="sim-card result-card">
                <div className="sim-row">
                  <span>Plano estimado</span>
                  <strong>{simResult.plano}</strong>
                </div>
                <div className="sim-row">
                  <span>Licenças</span>
                  <strong>{simResult.licencas}</strong>
                </div>
                <div className="sim-row">
                  <span>Números WhatsApp Web</span>
                  <strong>{simResult.custoWeb}</strong>
                </div>
                <div className="sim-row">
                  <span>Números API Oficial</span>
                  <strong>{simResult.custoOficial}</strong>
                </div>
                <div className="sim-row">
                  <span>Custo mensagens</span>
                  <strong>{simResult.custoMsg}</strong>
                </div>
                <div className="sim-total">
                  <span>Total mensal</span>
                  <strong>{simResult.total}</strong>
                </div>
                <p className="muted sim-note">Valores estimados com base na tabela de planos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEGURANÇA SECTION */}
        <section id="seguranca" className="section inverted">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Segurança & LGPD</p>
              <h2>Seus dados e os dos seus devedores, protegidos</h2>
              <p className="lead">Dado de dívida é dado sensível. Tratamos assim.</p>
            </div>
            <div className="seguranca-grid reveal">
              <div className="seguranca-card">
                <div className="seguranca-icon"><Shield size={24} /></div>
                <h3>Conformidade com a LGPD</h3>
                <p>Tratamento de dados sob base legal de execução de contrato e legítimo interesse, seguindo os princípios da Lei Geral de Proteção de Dados.</p>
              </div>

              <div className="seguranca-card">
                <div className="seguranca-icon"><Lock size={24} /></div>
                <h3>Criptografia em trânsito</h3>
                <p>Comunicação criptografada em trânsito, conforme padrão do WhatsApp Business API, para dados sensíveis de débito e negociação.</p>
              </div>

              <div className="seguranca-card">
                <div className="seguranca-icon"><Server size={24} /></div>
                <h3>Servidores e Backups seguros</h3>
                <p>Hospedagem em nuvem com replicação de dados e backups diários automáticos, reduzindo o risco de perda de histórico ou métricas importantes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">FAQ</p>
              <h2>Perguntas frequentes</h2>
              <p className="lead">Tudo o que você precisa saber antes de começar.</p>
            </div>
            <div className="faq-list reveal">
              {FAQS.map((item, index) => (
                <article className={`faq-item ${openFaqIndex === index ? 'open' : ''}`} key={index}>
                  <button className="faq-question" onClick={() => toggleFaq(index)} aria-expanded={openFaqIndex === index}>
                    {item.q}
                    <ChevronDown size={18} style={{ transform: openFaqIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  <div className="faq-answer" style={{ display: openFaqIndex === index ? 'block' : 'none' }}>
                    <p>{item.a}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="cta-row" style={{ marginTop: '2rem' }}>
              <a
                className="solid-btn"
                href={buildWaLink('faq', 'Ainda tenho uma dúvida sobre o CobZap.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ainda com dúvida? Fala com a gente
              </a>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a }
              }))
            })
          }}
        />
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <a href="#" onClick={(e) => handleNavLinkClick(e, 'hero')} aria-label="Voltar para a página inicial">
                <img src="/logo.png" alt="CobZap, plataforma de WhatsApp para cobrança" width="122" height="80" style={{ height: '80px', width: 'auto' }} />
              </a>
            </div>
            <p className="muted">Plataforma de WhatsApp para operações de cobrança.</p>
          </div>
          <div>
            <h4>Links</h4>
            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')}>Funcionalidades</a>
            <a href="#pricing" onClick={(e) => handleNavLinkClick(e, 'pricing')}>Planos</a>
            <a href="#faq" onClick={(e) => handleNavLinkClick(e, 'faq')}>FAQ</a>
          </div>
          <div>
            <h4>Contato</h4>
            <a href="mailto:contato@cobzap.com">contato@cobzap.com</a>
            <a href="tel:+5541995491030">WhatsApp: (41) 99549-1030</a>
          </div>
          <div>
            <h4>Social</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/cobzap" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/cobzap/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61584667976947" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 CobZap. Todos os direitos reservados.</span>
          <div className="legal">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
          </div>
        </div>
      </footer>
    </>
  );
}
