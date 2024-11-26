# Validate project react-app-customizer-snowflakes-client-side-solution

Date: 11/26/2024

## Findings

Following is the list of issues found in your project. [Summary](#Summary) of the recommended fixes is included at the end of the report.

### FN021002 @microsoft/sp-office-ui-fabric-core is not using exact version | Required

@microsoft/sp-office-ui-fabric-core is referenced using a range ^1.20.0. Install the exact version matching the project @microsoft/sp-office-ui-fabric-core@1.20.0

Execute the following command:

```sh
npm i -SE @microsoft/sp-office-ui-fabric-core@1.20.0
```

File: [./package.json:19:5](./package.json)

### FN017001 Run npm dedupe | Optional

If, after upgrading npm packages, when building the project you have errors similar to: "error TS2345: Argument of type 'SPHttpClientConfiguration' is not assignable to parameter of type 'SPHttpClientConfiguration'", try running 'npm dedupe' to cleanup npm packages.

Execute the following command:

```sh
npm dedupe
```

File: [./package.json](./package.json)

## Summary

### Execute script

```sh
npm i -SE @microsoft/sp-office-ui-fabric-core@1.20.0
npm dedupe
```