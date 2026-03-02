import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentStatusItem } from "@/services/dashboard.service";
import { Link } from "react-router-dom";
import { RoutePaths } from "@/config/route";
import { EStatusPage } from "@/enums/status.enum";

interface Props {
  pages: ContentStatusItem[];
}

export const ContentStatus = ({ pages }: Props) => {
  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Status</CardTitle>
          <CardDescription>Recently modified CMS pages and drafts</CardDescription>
        </div>

        <Button size="sm">
          <Link to={RoutePaths.CONTENT_PAGES}>+ NEW PAGE</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {pages?.length === 0 && (
          <p className="text-sm text-muted-foreground">No pages found</p>
        )}

        {pages?.slice(0, 3).map((page) => (
          <div key={page.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(page.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <Badge
              variant={page.status === EStatusPage.PUBLISHED ? "default" : "secondary"}
            >
              {page.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
