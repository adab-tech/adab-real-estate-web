# Opens Vercel project dashboard, env vars, and deployments in the default browser.
$urls = @(
  'https://vercel.com/adab-techs-projects/adab-real-estate-web',
  'https://vercel.com/adab-techs-projects/adab-real-estate-web/settings/environment-variables',
  'https://vercel.com/adab-techs-projects/adab-real-estate-web/deployments'
)
foreach ($url in $urls) {
  Start-Process $url
}
Write-Host "Opened $($urls.Count) Vercel tabs."
