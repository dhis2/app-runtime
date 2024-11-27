### Description

A playground for exploring the DHIS2 API and debugging Data Engine queries and mutations

#### How to publish

Since this lives in the repository with the app-runtime library, releasing new versions of this app should be done in a special way to avoid affecting the library's versions:

1. Add any new changes with `chore` commits (not `fix` or `feat`)
2. Make sure the supported DHIS2 versions are correct in `d2.config.js`
3. Manually update the app version in `package.json` -- **Don't use `yarn version`** because we don't want to a create a git tag for this repo
4. Add a `chore` commit for the version bump in `package.json` (make sure this will get its own commit on `master` and doesn't get squashed with others)
5. Build the app with `yarn build`
6. Publish the new version to the App Hub
    1. Either on the command line using [`yarn d2-app-scripts publish`](https://developers.dhis2.org/docs/app-platform/scripts/publish/) with an API key you generated on the App Hub
    2. Or by using the "New version" GUI on the App Hub by going to "Your Apps" => "Data Query Playground" => "New Version". This requires access to the DHIS2 organization
