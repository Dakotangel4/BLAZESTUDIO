import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AboutPage from "@/pages/about";
import ServicesPage from "@/pages/services";
import PortfolioPage from "@/pages/portfolio";
import TestimonialsPage from "@/pages/testimonials";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import BlogCategoryPage from "@/pages/blog-category";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/admin-login";
import AdminLeadsPage from "@/pages/admin-leads";
import AdminBlogsPage from "@/pages/admin-blogs";
import AdminBlogEditPage, { AdminBlogNewPage } from "@/pages/admin-blog-edit";
import AdminBlogCategoriesPage from "@/pages/admin-blog-categories";
import AdminTestimonialsPage from "@/pages/admin-testimonials";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/category/:slug" component={BlogCategoryPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/leads" component={AdminLeadsPage} />
      <Route path="/admin/testimonials" component={AdminTestimonialsPage} />
      <Route path="/admin/blogs/categories" component={AdminBlogCategoriesPage} />
      <Route path="/admin/blogs/new" component={AdminBlogNewPage} />
      <Route path="/admin/blogs/edit/:id" component={AdminBlogEditPage} />
      <Route path="/admin/blogs" component={AdminBlogsPage} />
      <Route path="/admin" component={AdminLeadsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <SonnerToaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
