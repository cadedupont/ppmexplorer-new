import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { PPMItem } from "@/lib/types";

const PPMItemDashboard = ({
  item
}: {
  item: PPMItem
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Caption (English):</CardTitle>
      </CardHeader>
      <CardContent>
        {item.caption_en}
      </CardContent>
    </Card>
  )
};

export default PPMItemDashboard;