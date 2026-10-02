using Microsoft.EntityFrameworkCore;
using AIDoctorAssistant.API.Data;
using AIDoctorAssistant.API.Hubs;
using AIDoctorAssistant.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR();
builder.Services.AddHttpClient<PythonBridgeService>();
builder.Services.AddHttpClient<GroqService>();
builder.Services.AddScoped<SummaryService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
policy.WithOrigins("http://localhost:5173", "http://localhost:5174")              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ConsultationHub>("/hubs/consultation");

app.Run();