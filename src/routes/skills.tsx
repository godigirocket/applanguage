import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { generateLessons } from "@/data/contentEngine";
import { summarizeSkills } from "@/lib/learning-collections";
export const Route = createFileRoute("/skills")({ component: SkillsPage });
function SkillsPage() {
  const { targetLanguage, completedLessons, isKidAccount, learningLevel,interfaceLanguage } = useStore();
  const t=(pt:string,en:string,es:string)=>interfaceLanguage==="pt"?pt:interfaceLanguage==="es"?es:en;
  const [lessons, setLessons] = useState<any[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setError(false);
    generateLessons(targetLanguage, Infinity, completedLessons, {
      kidMode: isKidAccount,
      progressiveLock: true,
      startLevel: learningLevel || undefined,
    })
      .then((data) => {
        if (active) setLessons(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [targetLanguage, completedLessons, isKidAccount, learningLevel]);
  const skills = summarizeSkills(lessons, completedLessons,interfaceLanguage);
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AppHeader />
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px" }}>
        <Link to="/home">{t("Voltar ao início","Back to home","Volver al inicio")}</Link>
        <h1 style={{ fontSize: "clamp(28px,5vw,40px)", margin: "24px 0 12px", fontWeight: 900 }}>
          {t("Suas habilidades","Your skills","Tus habilidades")}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
          {t("Acompanhe as lições concluídas em cada tema do seu idioma de estudo.","Track completed lessons in each topic of your learning language.","Sigue las lecciones completadas en cada tema de tu idioma de estudio.")}
        </p>
        {error && (
          <p role="alert">
            {t("Não foi possível carregar as habilidades.","Could not load skills.","No se pudieron cargar las habilidades.")} <Link to="/lessons">{t("Abrir lições","Open lessons","Abrir lecciones")}</Link>
          </p>
        )}
        {!skills.length && !error && <p role="status">{t("Carregando habilidades…","Loading skills…","Cargando habilidades…")}</p>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(270px,100%),1fr))",
            gap: 20,
          }}
        >
          {skills.map((skill) => (
            <article
              key={skill.id}
              className="lume-card"
              style={{
                padding: 24,
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{skill.title}</h2>
              <p style={{ margin: "12px 0" }}>
                {skill.completed} {t("de","of","de")} {skill.total} {t("lições","lessons","lecciones")} · {skill.xp} XP
              </p>
              <progress
                aria-label={`${t("Progresso em","Progress in","Progreso en")} ${skill.title}`}
                max={skill.total}
                value={skill.completed}
                style={{ width: "100%", accentColor: "var(--brand)" }}
              />
              <p style={{ margin: "10px 0 18px", color: "var(--text-secondary)" }}>
                {skill.percent}% {t("concluído","completed","completado")}
              </p>
              {skill.nextId ? (
                <Link to="/lesson/$id" params={{ id: skill.nextId }} className="btn-gold">
                  {t("Continuar tema","Continue topic","Continuar tema")}
                </Link>
              ) : skill.completed === skill.total ? (
                <Link
                  to="/lesson/$id"
                  params={{ id: lessons.find((l) => l.topic === skill.id).id }}
                >
                  {t("Revisar tema","Review topic","Repasar tema")}
                </Link>
              ) : (
                <Link to="/lessons">{t("Avance no caminho para desbloquear","Keep progressing to unlock","Avanza en el camino para desbloquear")}</Link>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
