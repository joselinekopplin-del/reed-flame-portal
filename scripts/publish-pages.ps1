$ErrorActionPreference = 'Stop'
$portalRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $portalRoot
try {
    foreach ($source in @('site/app.js','site/content.js','site/config.js')) {
        node --check $source
        if ($LASTEXITCODE -ne 0) { throw "JavaScript syntax check failed: $source" }
    }
    $pending = git status --porcelain -- site
    if ($pending) { throw 'Commit changes in site/ before publishing.' }
    $portalCommit = git subtree split --prefix site
    if ($LASTEXITCODE -ne 0) { throw 'Could not prepare the Pages commit.' }
    git push origin ('{0}:refs/heads/gh-pages' -f $portalCommit.Trim())
    if ($LASTEXITCODE -ne 0) { throw 'Pages push failed.' }
    Write-Output 'Pages branch published. Check the Pages build in GitHub.'
} finally {
    Pop-Location
}
