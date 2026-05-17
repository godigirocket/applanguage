import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

function GuidePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppHeader />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 120px', animation: 'pageEnter 0.6s ease-out both' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(32px,4vw,48px)', marginBottom: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Como usar o Lume
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            Um guia simples para tirar o máximo proveito da sua prática de conversação com inteligência artificial.
          </p>
        </div>

        {/* Guide sections */}
        <div className="glass" style={{ borderRadius: '24px', padding: '12px 32px', background: 'var(--surface-raised)', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
              color: 'var(--accent-green)',
              title: '1. Escolha um tema de conversa',
              body: 'Na tela inicial, você verá 8 temas: Vida Cotidiana, Arte & Cultura, Profissional, Conversa Livre, Confiança ao Falar, Viagem, Música e Relacionamentos. Escolha o que fizer mais sentido para você hoje.',
              tip: 'Dica: comece com "Conversa Livre" se não souber por onde começar.'
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                </svg>
              ),
              color: 'var(--accent-terra)',
              title: '2. Fale ou escreva',
              body: 'Você pode usar o botão de microfone para falar (recomendado!) ou digitar no campo de texto. Falar em voz alta é muito mais eficiente para desenvolver fluência.',
              tip: 'Dica: mesmo que você erre muito, continue. A IA corrige com gentileza.'
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              ),
              color: '#1B3A4B',
              title: '3. Escolha seu modo (Humor)',
              body: 'Antes de conversar, selecione um modo: Calmo (menos correções), Intensivo (feedback técnico), Cultural (contexto e referências), Confiança (zero correções, só encorajamento).',
              tip: 'Dica: use "Calmo" nos dias que estiver cansado. Use "Intensivo" quando quiser avançar rápido.'
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              ),
              color: '#7A4A8A',
              title: '4. Salve expressões',
              body: 'Quando a IA usar uma frase interessante, clique em "Salvar" embaixo da mensagem. Ela vai para sua biblioteca de expressões e fica disponível para revisar depois.',
              tip: 'Dica: tente salvar pelo menos 3 expressões por sessão.'
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.15"/>
                  <polyline points="5 3 19 12 5 21 5 3"/>
                </svg>
              ),
              color: '#C9A84C',
              title: '5. Jogue os quizzes',
              body: 'Na aba "Jogar" você encontra 4 modos: Quiz Rápido (10 perguntas), Speed Round (contra o tempo), Desafio Diário (bônus de XP) e Quiz Sequência (quanto mais acertar, mais XP).',
              tip: 'Dica: faça o Desafio Diário todo dia — é a forma mais rápida de ganhar XP.'
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
              color: '#4A7A5A',
              title: '6. Acompanhe seu progresso',
              body: 'Na aba "Progresso" você vê seu gráfico de confiança, conquistas desbloqueadas, expressões salvas e histórico de sessões. Quanto mais você pratica, mais o gráfico sobe.',
              tip: 'Dica: uma sessão por dia, mesmo que curta, é muito melhor do que uma sessão longa por semana.'
            },
          ].map((section, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '56px 1fr',
              gap: '24px', padding: '32px 0',
              borderBottom: i < 5 ? '1px solid #E0DDD6' : 'none'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: `${section.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: section.color, flexShrink: 0
              }}>
                {section.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
                  {section.body}
                </p>
                <div style={{
                  padding: '10px 14px', borderRadius: '10px',
                  background: `${section.color}08`,
                  border: `1px solid ${section.color}20`,
                  fontSize: '13px', color: section.color, fontWeight: 600
                }}>
                  {section.tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* iPhone Shortcut Instructions */}
        <div className="glass" style={{ borderRadius: '24px', padding: '32px', background: 'var(--surface-raised)', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '24px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: '#C4714A12',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-terra)', flexShrink: 0
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                📱 Como instalar no iPhone (Tela de Início)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                Você pode usar o Lume como um aplicativo de celular nativo! Isso remove a barra do navegador e deixa a experiência muito mais rápida e fluida.
              </p>
              
              <div style={{ display: 'grid', gap: '12px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, paddingLeft: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-terra)' }}>1.</span>
                  <span>Abra o <strong>Safari</strong> no seu iPhone e acesse o site do Lume.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-terra)' }}>2.</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> <span style={{ fontSize: '16px' }}>📤</span> (o quadrado com uma seta para cima na barra inferior).</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-terra)' }}>3.</span>
                  <span>Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> <span style={{ fontSize: '16px' }}>➕</span>.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-terra)' }}>4.</span>
                  <span>Digite "Lume" como nome (se já não estiver) e toque em <strong>"Adicionar"</strong> no canto superior direito.</span>
                </div>
              </div>

              <div style={{
                padding: '12px 14px', borderRadius: '10px',
                background: '#C4714A08',
                border: '1px solid #C4714A20',
                fontSize: '13px', color: 'var(--accent-terra)', fontWeight: 600,
                marginTop: '16px'
              }}>
                ✨ Pronto! O ícone do Lume aparecerá na sua tela inicial e funcionará em tela cheia com máxima fluidez!
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '48px', textAlign: 'center',
          padding: '48px', background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
          borderRadius: '24px', color: 'white',
          boxShadow: '0 8px 32px rgba(45,74,62,0.25)'
        }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>
            Pronto para começar?
          </h2>
          <p style={{ opacity: 0.8, marginBottom: '24px', fontSize: '15px' }}>
            Escolha um tema e faça sua primeira conversa agora.
          </p>
          <Link to="/home" style={{
            display: 'inline-block',
            padding: '14px 32px', borderRadius: '99px',
            background: 'var(--surface-raised)', color: 'var(--accent-green)',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }} className="hover:scale-[1.02]">
            Ir para o app →
          </Link>
        </div>
      </div>
    </div>
  );
}
