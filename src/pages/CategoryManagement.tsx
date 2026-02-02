import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  name: string;
  description: string;
  products: number;
}

const categories: Category[] = [
  { id: "1", name: "Electronics", description: "Modern gadgets and computing devices", products: 124 },
  { id: "2", name: "Accessories", description: "Peripheral items and add-ons", products: 56 },
  { id: "3", name: "Audio", description: "Headphones, speakers and sound systems", products: 89 },
  { id: "4", name: "Home Appliances", description: "Devices for household usage", products: 32 },
  { id: "5", name: "Wearables", description: "Smartwatches and fitness trackers", products: 41 },
  { id: "6", name: "Gaming", description: "Consoles and gaming peripherals", products: 67 },
];

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Category Management"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">CATEGORY NAME</TableHead>
              <TableHead className="font-semibold">DESCRIPTION</TableHead>
              <TableHead className="font-semibold">PRODUCTS</TableHead>
              <TableHead className="font-semibold text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {category.description}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-info/10 text-info">
                    {category.products} Items
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
