"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { BasicInfo } from "./calculator";

const formSchema = z.object({
  businessUrl: z.string().url("Please enter a valid URL"),
  businessType: z.string().min(2, "Please enter your business type"),
  location: z.string().min(2, "Please enter your location"),
  customerValue: z.coerce.number().positive("Please enter a positive value"),
  competitorType: z.enum(["manual", "auto"]),
});

interface BasicInfoFormProps {
  onSubmit: (data: BasicInfo) => void;
}

export const BasicInfoForm = ({ onSubmit }: BasicInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessUrl: "",
      businessType: "",
      location: "",
      customerValue: "",
      competitorType: "auto",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="businessUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Roofing, Home Improvement, Plumbing"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chicago, IL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Customer Value ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5000"
                    min={"1"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="competitorType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Competitor Selection</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">
                        Auto-detect competitors from Google
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Manually enter competitors</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  );
};
