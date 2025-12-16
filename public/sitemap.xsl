<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>Sitemap - THEJORD</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #0a0a0f;
            color: #e0e0e0;
            line-height: 1.6;
            padding: 2rem;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #2a2a35;
          }
          h1 {
            font-size: 1.5rem;
            color: #00d9ff;
            margin-bottom: 0.5rem;
          }
          .subtitle {
            color: #888;
            font-size: 0.9rem;
          }
          .stats {
            display: flex;
            gap: 2rem;
            margin-top: 1rem;
          }
          .stat {
            background: #1a1a25;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            border: 1px solid #2a2a35;
          }
          .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #00d9ff;
          }
          .stat-label {
            font-size: 0.8rem;
            color: #888;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5rem;
            font-size: 0.85rem;
          }
          th {
            background: #1a1a25;
            color: #00d9ff;
            padding: 0.75rem 1rem;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #2a2a35;
          }
          td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #1a1a25;
            vertical-align: top;
          }
          tr:hover {
            background: #12121a;
          }
          a {
            color: #00d9ff;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .priority-high {
            background: #00d9ff20;
            color: #00d9ff;
          }
          .priority-medium {
            background: #ffc10720;
            color: #ffc107;
          }
          .priority-low {
            background: #66666620;
            color: #888;
          }
          .alternates {
            font-size: 0.75rem;
            color: #666;
            margin-top: 0.25rem;
          }
          .alternate-tag {
            display: inline-block;
            background: #1a1a25;
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            margin-right: 0.25rem;
            margin-top: 0.25rem;
          }
          .alternate-tag.x-default {
            background: #00d9ff20;
            color: #00d9ff;
          }
          footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #2a2a35;
            color: #666;
            font-size: 0.8rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>THEJORD Sitemap</h1>
            <p class="subtitle">XML Sitemap for search engine indexing</p>
            <div class="stats">
              <div class="stat">
                <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total URLs</div>
              </div>
            </div>
          </header>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Freq</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending"/>
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    <xsl:if test="xhtml:link">
                      <div class="alternates">
                        <xsl:for-each select="xhtml:link">
                          <span class="alternate-tag">
                            <xsl:if test="@hreflang = 'x-default'">
                              <xsl:attribute name="class">alternate-tag x-default</xsl:attribute>
                            </xsl:if>
                            <xsl:value-of select="@hreflang"/>
                          </span>
                        </xsl:for-each>
                      </div>
                    </xsl:if>
                  </td>
                  <td>
                    <xsl:variable name="priority" select="sitemap:priority"/>
                    <span>
                      <xsl:attribute name="class">
                        <xsl:text>priority </xsl:text>
                        <xsl:choose>
                          <xsl:when test="$priority &gt;= 0.8">priority-high</xsl:when>
                          <xsl:when test="$priority &gt;= 0.5">priority-medium</xsl:when>
                          <xsl:otherwise>priority-low</xsl:otherwise>
                        </xsl:choose>
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <footer>
            <p>Generated by THEJORD - <a href="https://thejord.it">thejord.it</a></p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
