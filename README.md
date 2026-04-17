# rlukenbaugh-homepage

Static homepage project for `rlukenbaugh.org`.

## Files

- `index.html` - main landing page
- `vercel.json` - minimal Vercel configuration

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel as a new project.
3. Add these domains in Vercel:
   - `rlukenbaugh.org`
   - `www.rlukenbaugh.org`
4. Move product apps to their own subdomains:
   - `flights.rlukenbaugh.org`
   - `drone.rlukenbaugh.org`
   - `osint.rlukenbaugh.org`
   - `weather.rlukenbaugh.org`
   - `pricing.rlukenbaugh.org`

## Important

If `rlukenbaugh.org` is currently attached to another Vercel project, move that project to its own subdomain first before assigning the root domain to this homepage project.
