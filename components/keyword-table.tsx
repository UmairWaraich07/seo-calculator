"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KeywordTableProps {
  keywordData: any[];
  analysisScope?: "local" | "national";
}

export const KeywordTable = ({
  keywordData,
  analysisScope = "local",
}: KeywordTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<
    "keyword" | "searchVolume" | "clientRank"
  >("searchVolume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<"all" | "local" | "national">("all");

  // Filter and sort keywords
  const filteredKeywords = keywordData
    .filter((kw) => {
      // Apply search filter
      const matchesSearch = kw.keyword
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Apply local/national filter
      if (filter === "all") return matchesSearch;
      if (filter === "local") return matchesSearch && kw.isLocal;
      if (filter === "national") return matchesSearch && !kw.isLocal;

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortField === "keyword") {
        return sortDirection === "asc"
          ? a.keyword.localeCompare(b.keyword)
          : b.keyword.localeCompare(a.keyword);
      } else if (sortField === "searchVolume") {
        return sortDirection === "asc"
          ? a.searchVolume - b.searchVolume
          : b.searchVolume - a.searchVolume;
      } else {
        // Handle "Not ranked" values
        const rankA = a.clientRank === "Not ranked" ? 101 : a.clientRank;
        const rankB = b.clientRank === "Not ranked" ? 101 : b.clientRank;

        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }
    });

  const toggleSort = (field: "keyword" | "searchVolume" | "clientRank") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search keywords..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "local" | "national")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter keywords" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Keywords</SelectItem>
            <SelectItem value="local">Local Keywords</SelectItem>
            <SelectItem value="national">National Keywords</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("keyword")}
                  className="flex items-center p-0 h-auto font-semibold"
                >
                  Keyword
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("searchVolume")}
                  className="flex items-center p-0 h-auto font-semibold"
                >
                  Monthly Searches
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("clientRank")}
                  className="flex items-center p-0 h-auto font-semibold"
                >
                  Current Rank
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeywords.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-slate-500"
                >
                  No keywords found
                </TableCell>
              </TableRow>
            ) : (
              filteredKeywords.map((kw, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {kw.keyword}
                      {kw.isLocal && (
                        <Badge
                          variant="outline"
                          className="ml-2 flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          Local
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {kw.searchVolume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        kw.clientRank === "Not ranked"
                          ? "text-slate-500"
                          : kw.clientRank <= 3
                          ? "text-green-600 font-medium"
                          : kw.clientRank <= 10
                          ? "text-blue-600 font-medium"
                          : kw.clientRank <= 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }
                    >
                      {kw.clientRank}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
