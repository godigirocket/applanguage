import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { Book, ArrowLeft } from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "80px" }}>
      <AppHeader />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={16} />
          {isPT ? "Voltar ao início" : "Back to home"}
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <Book size={32} color="var(--brand)" />
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "var(--text-primary)" }}>
            {isPT ? "Termos de Uso" : "Terms of Service"}
          </h1>
        </div>

        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "40px" }}>
          {isPT ? "Última atualização: 25 de junho de 2026" : "Last updated: June 25, 2026"}
        </p>

        <div
          style={{
            background: "var(--surface-raised)",
            borderRadius: "20px",
            padding: "40px",
            border: "1.5px solid var(--border)",
          }}
        >
          <Section
            title={isPT ? "1. Aceitação dos Termos" : "1. Acceptance of Terms"}
            content={
              isPT
                ? "Ao acessar e usar a plataforma Lume, você concorda com estes Termos de Uso. Se você não concordar com algum termo, não utilize o serviço."
                : "By accessing and using the Lume platform, you agree to these Terms of Service. If you do not agree with any term, do not use the service."
            }
          />

          <Section
            title={isPT ? "2. Uso da Plataforma" : "2. Use of Platform"}
            content={
              isPT
                ? "A plataforma Lume oferece lições, jogos e conteúdo educacional para aprendizado de idiomas. Você se compromete a usar o serviço de forma responsável e apenas para fins educacionais."
                : "The Lume platform offers lessons, games and educational content for language learning. You agree to use the service responsibly and only for educational purposes."
            }
          />

          <Section
            title={isPT ? "3. Conta do Usuário" : "3. User Account"}
            content={
              isPT
                ? "Você é responsável por manter a confidencialidade de sua senha e conta. Você deve notificar-nos imediatamente sobre qualquer uso não autorizado."
                : "You are responsible for maintaining the confidentiality of your password and account. You must notify us immediately of any unauthorized use."
            }
          />

          <Section
            title={isPT ? "4. Pagamentos e Assinaturas" : "4. Payments and Subscriptions"}
            content={
              isPT
                ? "Os pagamentos são processados por plataforma externa (Cakto). As cobranças são feitas conforme o plano escolhido (mensal ou anual). Você pode cancelar a qualquer momento."
                : "Payments are processed by external platform (Cakto). Charges are made according to the chosen plan (monthly or annual). You can cancel at any time."
            }
          />

          <Section
            title={isPT ? "5. Cancelamento e Reembolso" : "5. Cancellation and Refund"}
            content={
              isPT
                ? "Você pode cancelar sua assinatura a qualquer momento. Oferecemos garantia de reembolso de 7 dias para novas assinaturas. Após este período, não haverá reembolso proporcional."
                : "You can cancel your subscription at any time. We offer a 7-day refund guarantee for new subscriptions. After this period, there will be no prorated refund."
            }
          />

          <Section
            title={isPT ? "6. Propriedade Intelectual" : "6. Intellectual Property"}
            content={
              isPT
                ? "Todo o conteúdo da plataforma (lições, textos, áudios, imagens) é de propriedade exclusiva da Lume ou de seus licenciadores. É proibida a reprodução sem autorização."
                : "All platform content (lessons, texts, audios, images) is the exclusive property of Lume or its licensors. Reproduction without authorization is prohibited."
            }
          />

          <Section
            title={isPT ? "7. Limitação de Responsabilidade" : "7. Limitation of Liability"}
            content={
              isPT
                ? "A Lume não garante resultados específicos no aprendizado de idiomas. O serviço é fornecido 'como está' sem garantias implícitas. Não nos responsabilizamos por danos indiretos."
                : "Lume does not guarantee specific language learning results. The service is provided 'as is' without implied warranties. We are not responsible for indirect damages."
            }
          />

          <Section
            title={isPT ? "8. Conduta do Usuário" : "8. User Conduct"}
            content={
              isPT
                ? "É proibido: compartilhar sua conta, usar bots ou automação, tentar acessar áreas restritas, distribuir conteúdo da plataforma, ou usar o serviço para fins ilegais."
                : "Prohibited: sharing your account, using bots or automation, attempting to access restricted areas, distributing platform content, or using the service for illegal purposes."
            }
          />

          <Section
            title={isPT ? "9. Modificações dos Termos" : "9. Modifications to Terms"}
            content={
              isPT
                ? "Podemos atualizar estes termos a qualquer momento. Alterações significativas serão notificadas por email. O uso continuado após alterações constitui aceitação dos novos termos."
                : "We may update these terms at any time. Significant changes will be notified by email. Continued use after changes constitutes acceptance of the new terms."
            }
          />

          <Section
            title={isPT ? "10. Contato" : "10. Contact"}
            content={
              isPT
                ? "Para dúvidas sobre estes termos, entre em contato através da página de Suporte ou pelo email suporte@lume.app"
                : "For questions about these terms, contact us through the Support page or email support@lume.app"
            }
          />
        </div>
      </main>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {content}
      </p>
    </div>
  );
}
