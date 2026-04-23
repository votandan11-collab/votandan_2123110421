# Stage 1: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# CHỈ SỬA ĐOẠN NÀY: Copy trực tiếp file csproj từ thư mục hiện tại
COPY ["ASP.NET.csproj", "./"]
RUN dotnet restore "ASP.NET.csproj"

# Copy toàn bộ code còn lại
COPY . .
RUN dotnet build "ASP.NET.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ASP.NET.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ASP.NET.dll"]