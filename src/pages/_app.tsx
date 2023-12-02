import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Head from "next/head";
import type { AppProps } from "next/app";
import { supabase } from "@/utils/supabase";
import Layout from "@/components/assistant/Layout";
import AdminLayout from "@/components/admin/AdminLayout";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const router = useRouter();
  const current =
    router.pathname.split("/")[1] !== ""
      ? router.pathname.split("/")[1]
      : "Home";
  current.charAt(0).toUpperCase() + current.slice(1);
  const title = "HR Management | " + current;

  useEffect(() => {
    const checkUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if ((!user || error) && !["/auth/login"].includes(router.pathname)) {
        router.push("/auth/login");
      } else if (
        user &&
        !user.user?.user_metadata?.is_admin === true &&
        ["/auth/login", "/admin", "/admin/assistants", "/admin/logs"].includes(
          router.pathname
        )
      ) {
        router.push("/");
      } else if (
        user &&
        user.user?.user_metadata?.is_admin === true &&
        ["/auth/login", "/"].includes(router.pathname)
      ) {
        router.push("/admin");
      }
    };

    checkUser();
  }, []);

  const excludeLayout: string[] = ["auth", "admin"];
  const applyLayout = !excludeLayout.includes(router.pathname.split("/")[1]);

  //exclude layout that are not for the admin
  const excludeAdminLayout: string[] = ["auth", "/"];
  const applyAdminLayout = !excludeAdminLayout.includes(
    router.pathname.split("/")[1]
  );

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider>
        <Notifications />
        <Head>
          <title>{title}</title>
        </Head>

        {applyLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : applyAdminLayout ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </MantineProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
