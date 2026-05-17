import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { AppHeader } from "@/components/lume/AppHeader";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

const SHOP_ITEMS = [
  { id: 'freeze', title: 'Congelamento de Ofensiva', desc: 'Mantenha sua ofensiva mesmo se perder um dia.', price: 50, icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round"><path d="m10 20-2-2 2-2"/><path d="m14 20 2-2-2-2"/><path d="m14 4 2 2-2 2"/><path d="m10 4-2 2 2 2"/><path d="m2 14 2-2-2-2"/><path d="m22 14-2-2 2-2"/><path d="M12 2v20"/><path d="m3 9 18 6"/><path d="m3 15 18-6"/></svg>' },
  { id: 'theme-dark', title: 'Tema: Noite Estrelada', desc: 'Um tema escuro exclusivo para o chat.', price: 100, icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B3A4B" stroke-width="2" stroke-linecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' },
  { id: 'avatar-crown', title: 'Coroa de Avatar', desc: 'Mostre a todos quem é o rei do vocabulário.', price: 200, icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>' },
  { id: 'bonus-xp', title: 'Poção de XP Duplo', desc: 'Ganha o dobro de XP pelos próximos 30 minutos.', price: 150, icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-terra)" stroke-width="2" stroke-linecap="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><line x1="5.52" x2="18.48" y1="16" y2="16"/></svg>' },
];

function ShopPage() {
  const { lumes, setLumes } = useStore();

  const handleBuy = (price: number) => {
    if (lumes >= price) {
      setLumes(lumes - price);
      alert('Compra realizada com sucesso!');
    } else {
      alert('Lumes insuficientes!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppHeader />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 120px', animation: 'pageEnter 0.6s ease-out both' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: Nunito, fontSize: 'clamp(32px,4vw,48px)', marginBottom: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Loja Virtual
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            Gaste seus Lumes conquistados duramente em itens exclusivos e vantagens.
          </p>
          <div style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface-raised)', padding: '12px 24px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '24px' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 9h8"/><path d="M8 15h8"/></svg></span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#C9A84C' }}>{lumes} Lumes</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {SHOP_ITEMS.map(item => (
            <div key={item.id} className="lume-card" style={{ background: 'var(--surface-raised)', borderRadius: '24px', padding: '24px', border: '1px solid #E0DDD650', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', marginBottom: '16px', margin: '0 auto' }} dangerouslySetInnerHTML={{ __html: item.icon }} />
              <h3 style={{ fontFamily: Nunito, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, flex: 1, marginBottom: '20px' }}>{item.desc}</p>
              
              <button 
                onClick={() => handleBuy(item.price)}
                disabled={lumes < item.price}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: lumes >= item.price ? '#C9A84C' : 'var(--border)',
                  color: lumes >= item.price ? 'white' : '#A8A8A0',
                  border: 'none', fontWeight: 700, cursor: lumes >= item.price ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Comprar por {item.price} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 9h8"/><path d="M8 15h8"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
