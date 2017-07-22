$fileDirectories = @(
"$PSScriptRoot\server\uploads\temp",
"$PSScriptRoot\server\uploads\mednickFileSystem"
)

foreach($dir in $fileDirectories)
{
    Write-Host $dir
    Get-ChildItem -Path $dir -Recurse| Foreach-object {Remove-item -Recurse -path $_.FullName }
}
#Get-ChildItem -Path $path -Recurse| Foreach-object {Remove-item -Recurse -path $_.FullName }
