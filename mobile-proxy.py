#!/usr/bin/env python3
"""
Simple HTTP proxy server for mobile development
Forwards requests from mobile device to localhost development server
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import sys

class MobileProxyHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[Proxy] {format % args}")
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        self.end_headers()
    
    def do_GET(self):
        """Forward GET requests to localhost"""
        try:
            target_url = f'http://127.0.0.1:3000{self.path}'
            print(f"[Proxy] GET {self.path} -> {target_url}")
            
            req = urllib.request.Request(target_url)
            with urllib.request.urlopen(req, timeout=30) as response:
                self.send_response(response.getcode())
                self.send_header('Access-Control-Allow-Origin', '*')
                
                # Copy headers from response
                for header, value in response.headers.items():
                    if header.lower() not in ['connection', 'transfer-encoding']:
                        self.send_header(header, value)
                
                self.end_headers()
                self.wfile.write(response.read())
                
        except urllib.error.URLError as e:
            print(f"[Proxy] Error connecting to {target_url}: {e}")
            self.send_error(502, f"Bad Gateway: {e}")
        except Exception as e:
            print(f"[Proxy] Unexpected error: {e}")
            self.send_error(500, f"Internal Server Error: {e}")
    
    def do_POST(self):
        """Forward POST requests to localhost"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''
            
            target_url = f'http://127.0.0.1:3000{self.path}'
            print(f"[Proxy] POST {self.path} -> {target_url} ({len(post_data)} bytes)")
            
            req = urllib.request.Request(
                target_url, 
                data=post_data,
                headers={
                    'Content-Type': self.headers.get('Content-Type', 'application/json'),
                    'User-Agent': 'Mobile-Proxy/1.0'
                }
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                self.send_response(response.getcode())
                self.send_header('Access-Control-Allow-Origin', '*')
                
                # Copy headers from response
                for header, value in response.headers.items():
                    if header.lower() not in ['connection', 'transfer-encoding']:
                        self.send_header(header, value)
                
                self.end_headers()
                self.wfile.write(response.read())
                
        except urllib.error.URLError as e:
            print(f"[Proxy] Error connecting to {target_url}: {e}")
            self.send_error(502, f"Bad Gateway: {e}")
        except Exception as e:
            print(f"[Proxy] Unexpected error: {e}")
            self.send_error(500, f"Internal Server Error: {e}")

if __name__ == "__main__":
    PORT = 8080
    print(f"Starting mobile proxy server...")
    print(f"Proxy will run on: http://0.0.0.0:{PORT}")
    print(f"Mobile devices can connect to: http://192.168.86.174:{PORT}")
    print(f"Forwarding requests to: http://127.0.0.1:3000")
    print(f"Press Ctrl+C to stop")
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), MobileProxyHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Proxy] Server stopped")
    except Exception as e:
        print(f"[Proxy] Failed to start server: {e}")
        sys.exit(1)