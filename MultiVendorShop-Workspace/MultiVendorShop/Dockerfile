FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /release

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /release .
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "MultiVendorShop.dll"]