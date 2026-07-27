import type { Metadata } from "next";
import { SmoothScroll } from "@/motion/smooth-scroll";
import { ActOne } from "@/scene/act-one";
import { DebugHud } from "@/scene/debug-hud";
import { Stage } from "@/scene/stage";

/**
 * Bancada de teste do Ato I. Existe pra olhar a cena isolada no navegador sem
 * mexer na home enquanto ela ainda é a versão antiga. Sai do ar quando o Ato I
 * entrar na página de verdade.
 */
export const metadata: Metadata = {
  title: "Laboratório — Ato I",
  robots: { index: false, follow: false },
};

export default function Laboratorio() {
  return (
    <SmoothScroll>
      <Stage />
      <DebugHud />
      <main className="relative z-10">
        <ActOne />
        <section className="flex h-screen items-center justify-center">
          <p className="eyebrow">fim do ato I</p>
        </section>
      </main>
    </SmoothScroll>
  );
}
