import { ActionsListWorkflowRunsForRepoResponseData } from 'detection'

export const response: ActionsListWorkflowRunsForRepoResponseData = {
  total_count: 4,
  workflow_runs: [
    {
      id: 135945392,
      node_id: 'MDExOldvcmtmbG93UnVuMTM1OTQ1Mzky',
      head_branch: 'baseBranch',
      head_sha: '4be24b2648c1bde30bc7f0358d251652a9aee08a',
      run_number: 23,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/135945392',
      pull_requests: [],
      created_at: '2020-06-15T12:10:40Z',
      updated_at: '2020-06-15T12:11:05Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/798304561',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/135945392/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: '4be24b2648c1bde30bc7f0358d251652a9aee08a',
        tree_id: '8f63d08ae9b376b7b17912bc44ff0bbd15bc5a14',
        message:
          'Feature/test1 (#2)\n\n* well done\r\n\r\n* running this everywhere\r\n\r\n* attempt to read the check run api\r\n\r\n* fixing yaml syntax\r\n\r\n* now looking for check_suites',
        timestamp: '2020-06-15T12:10:37Z',
        author: {
          name: 'Petar Shomov',
          email: 'pshomov@gmail.com',
        },
        committer: {
          name: 'GitHub',
          email: 'noreply@github.com',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
    {
      id: 93124540,
      node_id: 'MDExOldvcmtmbG93UnVuOTMxMjQ1NDA=',
      head_branch: 'baseBranch',
      head_sha: '3f92c034c80a7ae0734e0685bf0cd8591c1e1568',
      run_number: 15,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/93124540',
      pull_requests: [],
      created_at: '2020-05-01T14:20:18Z',
      updated_at: '2020-05-01T14:21:02Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/645584800',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/93124540/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: '3f92c034c80a7ae0734e0685bf0cd8591c1e1568',
        tree_id: '26a3e5b5c153d664ac14b502c50aa92ca03965df',
        message:
          'Feature/magic (#1)\n\n* 1\r\n\r\n* 2\r\n\r\n* 3\r\n\r\n* 4\r\n\r\n* 5\r\n\r\n* 6\r\n\r\n* 7\r\n\r\n* 8\r\n\r\n* 9\r\n\r\n* ssfd\r\n\r\n* asfdsdf\r\n\r\n* asfd',
        timestamp: '2020-05-01T14:20:16Z',
        author: {
          name: 'Petar Shomov',
          email: 'pshomov@gmail.com',
        },
        committer: {
          name: 'GitHub',
          email: 'noreply@github.com',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
    {
      id: 90615342,
      node_id: 'MDExOldvcmtmbG93UnVuOTA2MTUzNDI=',
      head_branch: 'baseBranch',
      head_sha: 'd89035753004221699c4896d76a4a94e3dfb1323',
      run_number: 2,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/90615342',
      pull_requests: [],
      created_at: '2020-04-28T22:46:45Z',
      updated_at: '2020-04-28T22:46:59Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/637140657',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90615342/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: 'd89035753004221699c4896d76a4a94e3dfb1323',
        tree_id: '7d1ee3b4fc32e51cd763b239694be790929de75e',
        message: 'Create test.txt',
        timestamp: '2020-04-28T22:46:43Z',
        author: {
          name: 'Petar Shomov',
          email: 'pshomov@gmail.com',
        },
        committer: {
          name: 'GitHub',
          email: 'noreply@github.com',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
    {
      id: 90614182,
      node_id: 'MDExOldvcmtmbG93UnVuOTA2MTQxODI=',
      head_branch: 'baseBranch',
      head_sha: '188ddd4db84a84753d16ab9441706fa5724b33de',
      run_number: 1,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/90614182',
      pull_requests: [],
      created_at: '2020-04-28T22:44:29Z',
      updated_at: '2020-04-28T22:44:45Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/637136326',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/90614182/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: '188ddd4db84a84753d16ab9441706fa5724b33de',
        tree_id: 'a0a42fc32e1c66be68c8ae1db29944d15017ae1d',
        message: 'adding action',
        timestamp: '2020-04-28T22:44:10Z',
        author: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
        committer: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
  ],
}