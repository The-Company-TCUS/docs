import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Icon } from '@iconify/react';
import {
  Anchor,
  Avatar,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { evaluateSync } from '@mdx-js/mdx';
import Details from '@theme/Details';
import moment from 'moment';
import { Octokit } from 'octokit';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import { useReleaseByTimeRange } from '../../hooks/useReleaseByTimeRange';

const ReleaseCard = ({ release }) => {
  const { default: BodyContent } = evaluateSync(release.body, {
    ...runtime,
  });

  return (
    <Group
      key={release.id}
      align="flex-start"
      className="mb-4 md:flex-row flex-col"
      spacing="lg"
      noWrap
    >
      <Stack justify="flex-start">
        <Tooltip.Floating label={moment(release.published_at).format('lll')}>
          <Text className="whitespace-nowrap">
            {moment(release.published_at).fromNow()}
          </Text>
        </Tooltip.Floating>
        <Stack spacing="xs" className="flex-row md:flex-col">
          <Group spacing="xs">
            <Avatar src={release.author.avatar_url} size={20} />
            <Anchor
              fz="sm"
              href={release.author.html_url}
              color="dimmed"
              target="_blank"
            >
              {release.author.login}
            </Anchor>
          </Group>
          <Anchor
            underline={false}
            color="dimmed"
            className="hover:text-blue-700"
            href={release.html_url.replace('releases/tag', 'tree')}
            target="_blank"
          >
            <Group spacing={14}>
              <Icon icon="octicon:tag-16" width={16} height={16} />
              <Text>{release.name}</Text>
            </Group>
          </Anchor>
        </Stack>
      </Stack>
      <Card className="w-300">
        <Title order={1}>{release.name}</Title>
        <BodyContent />
      </Card>
    </Group>
  );
};

const ReleaseByTimeRange = ({ owner, repo, from, to }) => {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const octokit = new Octokit({ auth: customFields.ghToken });

  const { releases, isFetching } = useReleaseByTimeRange(
    octokit,
    { owner, repo, perPage: 1 },
    from,
    to,
  );

  const fromTime = moment(from, 'MM-DD-YYYY');
  const toTime = moment(to, 'MM-DD-YYYY');

  const releaseList = releases?.map((release) => {
    return <ReleaseCard key={release.id} release={release} />;
  });

  return (
    <Details
      summary={
        <summary>
          <Group position="apart">
            <Text>
              View releases ({owner}/{repo})
            </Text>
            <Text fs="italic" fw={700}>
              Time: {fromTime.isValid() && `from ${fromTime.format('ll')} `}
              {toTime.isValid() ? `to ${toTime.format('ll')}` : 'to Current'}
            </Text>
          </Group>
        </summary>
      }
      open
    >
      <Title order={2}>{`${
        releases?.length || 'No'
      } version(s) released`}</Title>
      <Space h="md" />
      <ScrollArea className="h-80 relative">
        {releaseList}
        {isFetching && (
          <Center className="w-full" my="md">
            <Loader size="md" />
          </Center>
        )}
      </ScrollArea>
    </Details>
  );
};

export { ReleaseByTimeRange };
