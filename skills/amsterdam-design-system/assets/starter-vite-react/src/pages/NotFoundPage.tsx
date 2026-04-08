import { Grid, Heading, Paragraph, StandaloneLink } from "@amsterdam/design-system-react"

export function NotFoundPage() {
  return (
    <Grid as="main" id="main" paddingVertical="x-large">
      <Grid.Cell
        span={{ narrow: 4, medium: 6, wide: 8 }}
        start={{ narrow: 1, medium: 1, wide: 3 }}
      >
        <Heading level={1}>Pagina niet gevonden</Heading>
        <Paragraph>De pagina die u zoekt bestaat niet of is verplaatst.</Paragraph>
        <StandaloneLink href="/">Terug naar de homepage</StandaloneLink>
      </Grid.Cell>
    </Grid>
  )
}
