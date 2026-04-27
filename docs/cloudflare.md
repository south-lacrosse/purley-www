# Deploying To Cloudflare Pages

Cloudflare will host static sites for free, and the only restriction is the number of builds you can do a month (which is something like 500 per account, so plenty for us).

You can deploy by dragging and dropping files, or we chose to import from this GitHub repository, as that will then automatically run a build whenever changes are pushed to the repo.

To connect the repo to Cloudflare we had to install the `Cloudflare Workers and Pages` GitHub app. They recommend only allowing access for that app to the necessary repos, so at the time of writing that was just this one.

Useful links:

* [Cloudflare Dashboard]((https://dash.cloudflare.com/)) - to see Pages apps, on the left select Build > Compute > Workers & Pages
* [Branch Build Controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) - how to pause automatic building for a branch

## Cloudflare Account

We have created a Cloudflare account for the SEMLA Webmaster's Google account to host the website. To access the account you need to sign in using Google.

## Issue Connecting to GitHub

We had one issue when trying to connect Cloudflare to the repo that is worth noting here:

Cloudflare didn't recognise that is was connected to our GitHub account.

When we started the Create application process, and skipped the Workers page to get to Pages, we followed the instructions to install the Cloudflare app on GitHub, however when we returned from doing that in GitHub to Cloudflare we could not see the repo. On trying again Cloudflare took us to the GitHub page to configure the app which was already correctly configured, but even if we made changes Cloudflare still did not recognise that the app was set up.

We eventually went back to the first page after "Create application" (Create a Worker) and chose "Continue with GitHub" there. When we returned this time the connection was set up, so we went back and chose "Looking to deploy Pages? Get started", and the GitHub account and repo were now available.

## Connecting Other Repositories

Since we already have the Cloudflare app installed for this repo, the simplest way to deploy another repo is to first grant access from the app to that repo (which will probably need to be done by a South Lacrosse admin).

First go to the [South Lacrosse organization](https://github.com/south-lacrosse), then Settings, scroll down to find GitHub Apps on the left, click that and you should see the Cloudflare App. Click Configure, and scroll down to "Repository access" and add the new repo. Make sure you only grant access to the repositories you need.

Then [follow the Cloudflare instructions](https://developers.cloudflare.com/pages/get-started/git-integration/) - and make sure once you start the Create application process you click on "Looking to deploy Pages? Get started" (for some reason they like to make that difficult to find, it's at the bottom), otherwise you will deploy a Workers project.

### Adding a Custom Domain

Pages by default creates a subdomain `project.pages.dev`. As part of the setup process you should also setup a custom domain `project.southlacrosse.org.uk` - there should be a link during the setup, and the process is straightforward, just follow the instructions. It will ask you to add a DNS CNAME record which points to the `pages.dev` domain, so you will need access to the southlacrosse DNS settings.

Once that is done you should make sure the site is [redirected to the custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/).

Note it is important that the site has the canonical URL on each page (which we set in `BaseLayout.astro`), as if for any reason a crawler gets to the `pages.dev` pages then it will prevent the search engine from thinking it's duplicate content.
