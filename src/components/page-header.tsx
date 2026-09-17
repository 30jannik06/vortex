function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-[22px] leading-tight font-medium">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export { PageHeader }
