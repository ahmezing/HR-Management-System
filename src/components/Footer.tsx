import { createStyles, Anchor, Group, ActionIcon, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(0)} solid ${theme.colors.blue[1]}`,
    backgroundColor: theme.colors.blue, // Set the background color to light
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    backgroundColor: theme.colors.blue[5], // Set the background color to light

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}));

interface FooterCenteredProps {
  links: { link: string; label: string }[];
}

export default function Footer({ links }: FooterCenteredProps) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a">
      color="white"
      key={link.label}
      href={"/"}
      sx={{ lineHeight: 1 }}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        {/* <MantineLogo size={28} /> */}
        <Group spacing="xs" noWrap>
          <img src="/images/hr-logo.png" alt="logo" width="70" height="70" />
        </Group>

        <Group className={classes.links}>{items}</Group>

        <Group spacing="xs" position="right" noWrap>
          <Anchor<"a" | "button">
            href="https://twitter.com" // Link to Twitter
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandTwitter size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </Anchor>
          <Anchor<"a" | "button">
            href="https://youtube.com" // Link to YouTube
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandYoutube size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </Anchor>
          <Anchor<"a" | "button">
            href="https://instagram.com" // Link to Instagram
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandInstagram size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </Anchor>
        </Group>
      </div>
    </div>
  );
}
