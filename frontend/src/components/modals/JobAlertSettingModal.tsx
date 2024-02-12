import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  SEEK_ALERT_SETTING,
  GRAD_CONNECTION_ALERT_SETTING,
  GRAD_CONNECTION,
  SEEK,
} from "@/utils/constants";
import { ausgradUrlBuilder, seekUrlBuilder } from "@/utils/utils";
import axios from "@/lib/axiosConfig";

import { useModal } from "@/stores/useModal";
import { useScrapedSites } from "@/stores/useScrapedSites";
import { useCurrentScrapedSiteId } from "@/stores/useCurrentScrapedSiteId";

const formSchema = z.object({
  keywords: z.string().optional(),
  location: z.string().optional(),
  classification: z.string().optional(),
  jobType: z.string().optional(),
  maxPages: z.string(),
  frequency: z.string(),
  isNotifyEmail: z.boolean().default(false),
  isNotifyWebsite: z.boolean().default(false),
});

const JobAlertSettingModal = () => {
  const { scrapedSites, setScrapedSites } = useScrapedSites();
  const { currentScrapedSiteId, setCurrentScrapedSiteId } =
    useCurrentScrapedSiteId();

  const [formedUrl, setFormedUrl] = useState<string>("");
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "editJobAlertSetting";
  const { alertSetting, websiteName } = data;

  useEffect(() => {
    console.log(alertSetting);
    if (alertSetting) {
      form.setValue("keywords", alertSetting.search_keyword);
      form.setValue("location", alertSetting.location);
      form.setValue("classification", alertSetting.classification);
      form.setValue("jobType", alertSetting.job_type);
      form.setValue("maxPages", alertSetting.max_pages_to_scrape.toString());
      form.setValue("frequency", alertSetting.scrape_frequency.toString());
      form.setValue("isNotifyEmail", alertSetting.is_notify_email);
      form.setValue("isNotifyWebsite", alertSetting.is_notify_on_website);

      let formedUrl = "";
      if (websiteName === GRAD_CONNECTION) {
        formedUrl = ausgradUrlBuilder(
          alertSetting.search_keyword,
          alertSetting.job_type,
          alertSetting.classification,
          alertSetting.location
        );
      } else if (websiteName === SEEK) {
        formedUrl = seekUrlBuilder(
          alertSetting.search_keyword,
          alertSetting.job_type,
          alertSetting.classification,
          alertSetting.location
        );
      }
      setFormedUrl(formedUrl);
    }
  }, [alertSetting]);

  const resetSettings = () => {
    if (alertSetting) {
      form.setValue("keywords", alertSetting.search_keyword);
      form.setValue("location", alertSetting.location);
      form.setValue("classification", alertSetting.classification);
      form.setValue("jobType", alertSetting.job_type);
      form.setValue("maxPages", alertSetting.max_pages_to_scrape.toString());
      form.setValue("frequency", alertSetting.scrape_frequency.toString());
      form.setValue("isNotifyEmail", alertSetting.is_notify_email);
      form.setValue("isNotifyWebsite", alertSetting.is_notify_on_website);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      location: "",
      classification: "",
      jobType: "",
      maxPages: "1",
      frequency: "1",
      isNotifyEmail: false,
      isNotifyWebsite: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      const res = await axios.put(
        `/scraped-site-settings/${alertSetting?.id}`,
        {
          scrapeFrequency: data.frequency,
          maxPagesToScrape: data.maxPages,
          isNotifyEmail: data.isNotifyEmail,
          isNotifyOnWebsite: data.isNotifyWebsite,
          searchKeyword: data.keywords,
          location: data.location,
          jobType: data.jobType,
          classification: data.classification,
        }
      );
      const updatedSettings = res.data;

      if (currentScrapedSiteId) {
        //update scrapedSites
        const updatedScrapedSites = scrapedSites.map((site) => {
          if (site.id.toString() === currentScrapedSiteId) {
            site.scraped_site_settings = updatedSettings;
            return site;
          }
          return site;
        });
        setScrapedSites(updatedScrapedSites);
      }

      //update modal with new data
      onOpen("editJobAlertSetting", {
        alertSetting: updatedSettings,
        websiteName,
      });

      //update scrapedSites
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    resetSettings();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-[600px]">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Job Alerts
          </DialogTitle>
          <DialogDescription className="text-center">
            Get notified when new jobs are posted that match your saved search
            criteria.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-6">
              <div className="flex flex-col space-y-2">
                <Label>Website</Label>
                <Input placeholder="Keywords" value={websiteName} readOnly />
              </div>

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="Keywords" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-3 w-full">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={"Select location"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {websiteName === GRAD_CONNECTION &&
                            GRAD_CONNECTION_ALERT_SETTING.location.map(
                              (location, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={location.value}
                                  >
                                    {location.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          {websiteName === SEEK &&
                            SEEK_ALERT_SETTING.location.map(
                              (location, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={location.value}
                                  >
                                    {location.name}
                                  </SelectItem>
                                );
                              }
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Classification</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={"Classification"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {websiteName === GRAD_CONNECTION &&
                            GRAD_CONNECTION_ALERT_SETTING.classification.map(
                              (classification, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={classification.value}
                                  >
                                    {classification.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          {websiteName === SEEK &&
                            SEEK_ALERT_SETTING.classification.map(
                              (classification, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={classification.value}
                                  >
                                    {classification.name}
                                  </SelectItem>
                                );
                              }
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-3 w-full">
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Job type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {websiteName === GRAD_CONNECTION &&
                            GRAD_CONNECTION_ALERT_SETTING.jobType.map(
                              (jobType, index) => {
                                return (
                                  <SelectItem key={index} value={jobType.value}>
                                    {jobType.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          {websiteName === SEEK &&
                            SEEK_ALERT_SETTING.jobType.map((jobType, index) => {
                              return (
                                <SelectItem key={index} value={jobType.value}>
                                  {jobType.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPages"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Max pages to scrape</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"1"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2 w-full pt-1">
                <Label>Formed URL</Label>
                <div className="flex items-center space-x-2">
                  <Input placeholder="URL" readOnly value={formedUrl} />
                  <Button
                    variant="primary"
                    className="text-white bg-blue-500"
                    onClick={() => window.open(formedUrl, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      How often do you want to check for new jobs
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex items-center space-x-6 "
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="1"
                              id="Daily"
                              className="text-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Daily</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="7"
                              id="Weekly"
                              className="text-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Weekly</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value="0"
                              id="Never"
                              className="text-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Don't send me job alerts
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-2 w-full pt-2">
                <Label>Notifications</Label>
                <div className="flex items-center space-x-6 pt-1">
                  <FormField
                    control={form.control}
                    name="isNotifyEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center">
                        <FormControl>
                          <Switch
                            className="data-[state=checked]:bg-blue-500"
                            id="notifyEmail"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label
                          htmlFor="notifyEmail"
                          className="!my-0 ml-2 font-normal"
                        >
                          Email
                        </Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNotifyWebsite"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center">
                        <FormControl>
                          <Switch
                            className="data-[state=checked]:bg-blue-500"
                            id="notifyEmail"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label
                          htmlFor="notifyEmail"
                          className="!my-0 ml-2 font-normal"
                        >
                          On Website
                        </Label>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center ml-auto">
                <Button
                  variant="ghost"
                  className="mr-2 hover:text-zinc-500"
                  onClick={handleCloseModal}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                >
                  Save changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobAlertSettingModal;
