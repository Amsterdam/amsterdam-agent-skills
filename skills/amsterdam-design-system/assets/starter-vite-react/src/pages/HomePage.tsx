import {
  Badge,
  Breakout,
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
  Row,
  Spotlight,
  StandaloneLink,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import { useQuery } from "@tanstack/react-query"

import { StatCard } from "@/components/StatCard"

/*
 * HomePage — the worked example from references/aesthetic-discipline.md.
 *
 * Discipline answers (must hold for any rewrite of this file):
 *   1. Dominant color   → --ams-color-background (white) + one azure Spotlight band
 *   2. Sharp accent     → --ams-color-highlight-magenta on:
 *                          (a) the hero Badge
 *                          (b) the StatCard left border on KPI #1
 *                          (c) the CTA "Aanmelden" Button (custom variant)
 *                         Three uses, no more.
 *   3. Rhythm           → hero 2x-large, KPI strip large, body x-large
 *   4. Page-load moment → .ams-reveal stagger on the four hero cells
 *   5. Memorable        → asymmetric editorial column at start={{ wide: 2 }} / span={{ wide: 7 }}
 *
 * Every element on this page maps to one of these. If you add an element
 * that does not, you are diluting the design.
 */

interface ProgressData {
  ongoingProjects: number
  completedThisQuarter: number
  upcomingMilestones: number
}

async function fetchProgress(): Promise<ProgressData> {
  // Stub. Replace with a real API call when wiring this to a backend.
  return {
    ongoingProjects: 47,
    completedThisQuarter: 12,
    upcomingMilestones: 8,
  }
}

export function HomePage() {
  const { data } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  })

  return (
    <main id="main">
      {/* HERO — dominant Spotlight band, staggered reveal cascade */}
      <Spotlight color="azure">
        <Grid paddingVertical="2x-large">
          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 8 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Paragraph
              size="small"
              color="inverse"
              className="uppercase tracking-[0.15em]"
            >
              Programma Zuidas — 2026 → 2031
            </Paragraph>
          </Grid.Cell>

          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 8 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Heading level={1} color="inverse">
              Een nieuwe entree voor Amsterdam Zuid
            </Heading>
          </Grid.Cell>

          <Grid.Cell
            span={{ narrow: 4, medium: 5, wide: 6 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Paragraph size="large" color="inverse">
              Vijf jaar bouwen aan de poort van de stad. Nieuwe sporen, nieuwe
              pleinen, nieuwe verbindingen — voor wie hier woont, werkt en
              aankomt.
            </Paragraph>
          </Grid.Cell>

          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 6 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Row gap="small" alignVertical="center">
              {/* The ONE magenta moment in the hero */}
              <Badge color="magenta" label="Nieuw rapport: voortgang Q1" />
              <StandaloneLink
                href="/rapport"
                icon={ChevronForwardIcon}
                color="inverse"
              >
                Lees het rapport
              </StandaloneLink>
            </Row>
          </Grid.Cell>
        </Grid>
      </Spotlight>

      {/*
        KPI STRIP — dense rhythm (paddingVertical="large"), narrower than the
        hero (start={2} span={10} on wide). The first card carries the magenta
        accent border. The other two are neutral.
      */}
      <Grid as="section" paddingVertical="large">
        <Grid.Cell
          span={{ narrow: 4, medium: 8, wide: 10 }}
          start={{ narrow: 1, medium: 1, wide: 2 }}
        >
          <Row gap="small" wrap>
            <StatCard
              label="Lopende projecten"
              value={data?.ongoingProjects ?? "—"}
              accent="magenta"
            />
            <StatCard
              label="Afgerond dit kwartaal"
              value={data?.completedThisQuarter ?? "—"}
            />
            <StatCard
              label="Aankomende mijlpalen"
              value={data?.upcomingMilestones ?? "—"}
            />
          </Row>
        </Grid.Cell>
      </Grid>

      {/*
        BODY — off-center editorial column at start={2} span={7} on wide.
        Outer Column gap="large" separates sections; inner gap="small" keeps
        heading-to-paragraph cohesion within each section.
      */}
      <Grid as="article" paddingVertical="x-large">
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 7 }}
          start={{ narrow: 1, medium: 2, wide: 2 }}
        >
          <Column gap="large">
            <Column gap="small">
              <Heading level={2}>De vier ingrepen</Heading>
              <Paragraph>
                Het Programma Zuidas bestaat uit vier samenhangende projecten
                die de bereikbaarheid, leefbaarheid en ruimtelijke kwaliteit
                van het gebied verbeteren.
              </Paragraph>
              <Paragraph>
                De ingrepen zijn op elkaar afgestemd: het verleggen van de
                snelweg maakt ruimte voor nieuwe stadspleinen, en de uitbreiding
                van het station maakt de groei van het werkgebied mogelijk.
              </Paragraph>
            </Column>

            <Column gap="small">
              <Heading level={2} size="level-3">
                Tijdpad
              </Heading>
              <Paragraph>
                De werkzaamheden lopen van begin 2026 tot eind 2031. Per fase
                vindt u op deze website een planning, hinderkaart en
                contactgegevens van de uitvoerders.
              </Paragraph>
            </Column>

            <Column gap="small">
              <Heading level={2} size="level-3">
                Meedenken en meedoen
              </Heading>
              <Paragraph>
                Bewoners, ondernemers en bezoekers worden bij elke fase
                geconsulteerd. Inloopavonden vinden maandelijks plaats in het
                informatiecentrum aan de Strawinskylaan.
              </Paragraph>
              <StandaloneLink href="/meedoen" icon={ChevronForwardIcon}>
                Bekijk de agenda
              </StandaloneLink>
            </Column>
          </Column>
        </Grid.Cell>
      </Grid>

      {/*
        BREAKOUT — the page's one memorable element. A full-bleed colored
        band invites the eye to break out of the editorial column rhythm.
        Replace with an <Image> when you have a hero render available.
      */}
      <Breakout>
        <Breakout.Cell colSpan="all">
          <div className="bg-ams-azure h-48 flex items-center justify-center">
            <Paragraph color="inverse" size="large">
              Hier komt de masterplan-render (16:5)
            </Paragraph>
          </div>
        </Breakout.Cell>
      </Breakout>

      {/*
        NEWSLETTER — dense rhythm again (large), centered narrow column.
        The Button is the third and final magenta moment on the page —
        styled via a className override that maps to bg-ams-magenta.
      */}
      <Grid as="section" paddingVertical="large">
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 6 }}
          start={{ narrow: 1, medium: 2, wide: 4 }}
        >
          <Column gap="small">
            <Heading level={2}>Blijf op de hoogte</Heading>
            <Paragraph>
              Eens per maand een korte update over de bouwwerkzaamheden in
              Zuidas. U kunt zich op elk moment afmelden.
            </Paragraph>
            <Button
              variant="primary"
              className="!bg-ams-magenta !border-ams-magenta hover:!bg-ams-magenta/90"
            >
              Aanmelden voor de nieuwsbrief
            </Button>
          </Column>
        </Grid.Cell>
      </Grid>
    </main>
  )
}
