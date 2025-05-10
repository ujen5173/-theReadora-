"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CheckCircle2, Crown, Loader2, Lock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useProfileStore } from "~/store/profile-store";
import { api } from "~/trpc/react";
import { makeSlug } from "~/utils/helpers";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z0-9\s]*$/, {
      message: "Name can only contain letters, numbers, and spaces.",
    }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .transform((val) => makeSlug(val))
    .refine((val) => /^[a-z0-9-]*$/.test(val), {
      message:
        "Username can only contain lowercase letters, numbers, and hyphens.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = () => {
  const {
    name,
    username,
    email,
    bio,
    setProfile,
    image,
    createdAt,
    updatedAt,
    premium,
    premiumUntil,
  } = useProfileStore();

  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name,
      username,
      email,
      bio: bio ?? "",
    },
  });

  const { isLoading: isCheckingUsername, refetch: checkUsernameAvailability } =
    api.user.checkUsername.useQuery(
      {
        username: form?.watch("username") ?? "",
      },
      {
        enabled: false,
      }
    );

  const { mutateAsync, status } = api.user.updateUser.useMutation();

  const currentUsername = form.watch("username");

  // Check if the check button should be disabled
  const isCheckButtonDisabled =
    isCheckingUsername ||
    !currentUsername ||
    currentUsername.length < 3 ||
    currentUsername === username;

  useEffect(() => {
    form.reset({
      name,
      username,
      email,
      bio: bio ?? "",
    });
  }, [name, username, email, bio, form]);

  const checkUsername = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameStatus({
        available: false,
        message: "Username must be at least 3 characters",
      });
      return false;
    }

    // Transform username to match the same format as auth
    const formattedUsername = makeSlug(usernameToCheck);

    // Check for invalid characters
    if (!/^[a-z0-9-]*$/.test(formattedUsername)) {
      setUsernameStatus({
        available: false,
        message:
          "Username can only contain lowercase letters, numbers, and hyphens",
      });
      return false;
    }

    setUsernameStatus(null);

    try {
      const result = await checkUsernameAvailability();
      const isAvailable = !result.data;
      setUsernameStatus({
        available: isAvailable,
        message: isAvailable
          ? "Username is available"
          : "Username is already taken",
      });
      return isAvailable;
    } catch (error) {
      toast.error("Failed to check username availability");
      return false;
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      // check username automatically if not checked.
      if (data.username !== username && !usernameStatus) {
        const isAvailable = await checkUsername(data.username);
        if (!isAvailable) {
          toast.error("Please choose a different username");
          return;
        }
      }

      if (usernameStatus && !usernameStatus.available) {
        toast.error("Please choose a different username");
        return;
      }

      setProfile({ ...data, image: image ?? undefined });
      await mutateAsync({ ...data, image: image ?? undefined });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Personal Information</h4>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      size="lg"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ""
                        );
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Only letters, numbers, and spaces are allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          size="lg"
                          {...field}
                          onChange={(e) => {
                            const value = makeSlug(e.target.value);
                            field.onChange(value);
                          }}
                          className={cn(
                            usernameStatus &&
                              (usernameStatus.available
                                ? "border-green-500 focus-visible:ring-green-500"
                                : "border-red-500 focus-visible:ring-red-500")
                          )}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        icon={isCheckingUsername ? Loader2 : undefined}
                        iconStyle={
                          isCheckingUsername ? "animate-spin" : undefined
                        }
                        disabled={isCheckButtonDisabled}
                        onClick={() => checkUsername(field.value)}
                      >
                        Check
                      </Button>
                    </div>
                    <FormDescription>
                      Only lowercase letters, numbers, and hyphens are allowed
                    </FormDescription>
                    {usernameStatus && (
                      <div
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          usernameStatus.available
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {usernameStatus.available ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                        <span>{usernameStatus.message}</span>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled size="lg" {...field} />
                  </FormControl>
                  <FormDescription>Email cannot be changed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell us a little bit about yourself
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Account Details</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Account Created
              </label>
              <p className="text-sm text-muted-foreground">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Last Updated
              </label>
              <p className="text-sm text-muted-foreground">
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Premium Status
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    premium ? "bg-green-500" : "bg-muted"
                  }`}
                />
                <p className="text-sm text-muted-foreground">
                  {premium ? (
                    <span className="flex items-center gap-1.5">
                      <Crown className="size-4 text-primary" />
                      Active Premium Member
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Lock className="size-4 text-muted-foreground" />
                      Free Account
                    </span>
                  )}
                </p>
              </div>
              {premium && premiumUntil && (
                <p className="text-xs text-muted-foreground mt-1">
                  Until {format(premiumUntil, "MMM d, yyyy")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={status === "pending"}
            onClick={() => {
              form.reset({
                name,
                username,
                email,
                bio: bio ?? "",
              });
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={status === "pending"}
            icon={status === "pending" ? Loader2 : undefined}
            iconStyle={status === "pending" ? "animate-spin" : undefined}
          >
            {status === "pending" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
