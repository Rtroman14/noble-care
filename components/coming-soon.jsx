import { PageBody } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export function ComingSoon({ icon: Icon, title, description, points = [] }) {
  return (
    <PageBody>
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <Badge variant="secondary" className="mx-auto">
            Coming soon
          </Badge>
          <EmptyTitle className="text-lg">{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {points.length > 0 && (
          <EmptyContent>
            <ul className="flex flex-col gap-1.5 text-left text-sm text-muted-foreground">
              {points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </EmptyContent>
        )}
      </Empty>
    </PageBody>
  )
}
