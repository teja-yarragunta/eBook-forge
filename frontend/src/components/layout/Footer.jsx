import React from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const socials = [
    { name: "GitHub", href: "https://github.com/teja-yarragunta", Icon: Github },
    { name: "Instagram", href: "https://www.instagram.com/tejayarragunta/", Icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/teja-yarragunta/", Icon: Linkedin },
    { name: "Email", href: "mailto:mail.yarragunta.teja@gmail.com", Icon: Mail },
  ];

  return (
    <footer className="border-t border-gray-100 bg-linear-to-br from-purple-200 to purple-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {year}{" "}
              <span className="font-medium text-gray-900">eBook-Forge</span>.
              All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socials.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="p-2.5 rounded-lg text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
