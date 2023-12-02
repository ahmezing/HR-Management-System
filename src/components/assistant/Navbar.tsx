//src\components\Navbar.tsx

import { useEffect, useState } from "react";
import router from "next/router";
import { logout } from "../../server/auth";
import { createStyles, Navbar, Group, getStylesRef, rem } from "@mantine/core";
import { IconHome2, IconLogout } from "@tabler/icons-react";
import { useSession } from "@supabase/auth-helpers-react";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    position: "sticky", // Add this line
    top: 0, // Add this line
    zIndex: 1000, // Add this line
    height: "100vh", // Add this line
  },

  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    )}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    )}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.white,
    opacity: 0.75,
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
}));

export function NavbarSimpleColored() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");
  const session = useSession();

  useEffect(() => {
    if (!session) return;
  }, [session]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  const data = [{ link: "/", label: "Home", icon: IconHome2 }];

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        router.push(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section>
        <Group
          className={classes.header}
          position="apart"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <MantineLogo size={28} inverted /> */}
          <img src="/images/hr-logo.png" alt="logo" width="150" height="150" />
        </Group>
      </Navbar.Section>

      <Navbar.Section grow>{links}</Navbar.Section>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <a
          href="https://www.absher.sa/portal/landing.html"
          className={classes.link}
          target="_blank"
        >
          <img
            src="https://www.absher.sa/wps/wcm/connect/individuals/0552dee2-f28f-4485-9590-54f93246b13d/logo.png?MOD=AJPERES"
            alt="google"
            width="60"
            height="50"
          />
        </a>

        <a
          href="https://www.hrsd.gov.sa/"
          className={classes.link}
          target="_blank"
        >
          <img
            src="https://www.hrsd.gov.sa/logo-ar.svg"
            alt="google"
            width="60"
            height="50"
          />
        </a>
      </div>
      <Navbar.Section className={classes.footer}>
        <a
          href="/auth/login"
          className={classes.link}
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}

export default NavbarSimpleColored;
