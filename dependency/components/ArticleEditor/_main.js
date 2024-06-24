﻿webCpu.regComponent("ArticleEditor", {
  html: '<div class="toolbar-container"></div>\
  <div class="editor-container" style="height: calc( 100% - 120px ); overflow: auto;"></div>',
  css: {
    editor: "data:text/css;base64,OnJvb3QsCjpob3N0IHsKICAtLXctZS10ZXh0YXJlYS1iZy1jb2xvcjogI2ZmZjsKICAtLXctZS10ZXh0YXJlYS1jb2xvcjogIzMzMzsKICAtLXctZS10ZXh0YXJlYS1ib3JkZXItY29sb3I6ICNjY2M7CiAgLS13LWUtdGV4dGFyZWEtc2xpZ2h0LWJvcmRlci1jb2xvcjogI2U4ZThlODsKICAtLXctZS10ZXh0YXJlYS1zbGlnaHQtY29sb3I6ICNkNGQ0ZDQ7CiAgLS13LWUtdGV4dGFyZWEtc2xpZ2h0LWJnLWNvbG9yOiAjZjVmMmYwOwogIC0tdy1lLXRleHRhcmVhLXNlbGVjdGVkLWJvcmRlci1jb2xvcjogI0I0RDVGRjsKICAtLXctZS10ZXh0YXJlYS1oYW5kbGVyLWJnLWNvbG9yOiAjNDI5MGY3OwogIC0tdy1lLXRvb2xiYXItY29sb3I6ICM1OTU5NTk7CiAgLS13LWUtdG9vbGJhci1iZy1jb2xvcjogI2ZmZjsKICAtLXctZS10b29sYmFyLWFjdGl2ZS1jb2xvcjogIzMzMzsKICAtLXctZS10b29sYmFyLWFjdGl2ZS1iZy1jb2xvcjogI2YxZjFmMTsKICAtLXctZS10b29sYmFyLWRpc2FibGVkLWNvbG9yOiAjOTk5OwogIC0tdy1lLXRvb2xiYXItYm9yZGVyLWNvbG9yOiAjZThlOGU4OwogIC0tdy1lLW1vZGFsLWJ1dHRvbi1iZy1jb2xvcjogI2ZhZmFmYTsKICAtLXctZS1tb2RhbC1idXR0b24tYm9yZGVyLWNvbG9yOiAjZDlkOWQ5Owp9Cgoudy1lLXRleHQtY29udGFpbmVyICosCi53LWUtdG9vbGJhciAqIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogIG1hcmdpbjogMDsKICBvdXRsaW5lOiBub25lOwogIHBhZGRpbmc6IDAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBibG9ja3F1b3RlLAoudy1lLXRleHQtY29udGFpbmVyIGxpLAoudy1lLXRleHQtY29udGFpbmVyIHAsCi53LWUtdGV4dC1jb250YWluZXIgdGQsCi53LWUtdGV4dC1jb250YWluZXIgdGgsCi53LWUtdG9vbGJhciAqIHsKICBsaW5lLWhlaWdodDogMS41Cn0KCi53LWUtdGV4dC1jb250YWluZXIgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10ZXh0YXJlYS1iZy1jb2xvcik7CiAgY29sb3I6IHZhcigtLXctZS10ZXh0YXJlYS1jb2xvcik7CiAgaGVpZ2h0OiAxMDAlOwogIHBvc2l0aW9uOiByZWxhdGl2ZQp9Cgoudy1lLXRleHQtY29udGFpbmVyIC53LWUtc2Nyb2xsIHsKICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7CiAgaGVpZ2h0OiAxMDAlCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSB7CiAgd29yZC13cmFwOiBicmVhay13b3JkOwogIGJvcmRlci10b3A6IDFweCBzb2xpZCB0cmFuc3BhcmVudDsKICBtaW4taGVpZ2h0OiAxMDAlOwogIG91dGxpbmU6IDA7CiAgcGFkZGluZzogMCAxMHB4OwogIHdoaXRlLXNwYWNlOiBwcmUtd3JhcAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcCB7CiAgbWFyZ2luOiAxNXB4IDAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIGgxLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gaDIsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBoMywKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIGg0LAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gaDUgewogIG1hcmdpbjogMjBweCAwCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBpbWcgewogIGN1cnNvcjogZGVmYXVsdDsKICBkaXNwbGF5OiBpbmxpbmUgIWltcG9ydGFudDsKICBtYXgtd2lkdGg6IDEwMCU7CiAgbWluLWhlaWdodDogMjBweDsKICBtaW4td2lkdGg6IDIwcHgKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHNwYW4gewogIHRleHQtaW5kZW50OiAwCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBbZGF0YS1zZWxlY3RlZD10cnVlXSB7CiAgYm94LXNoYWRvdzogMCAwIDAgMnB4IHZhcigtLXctZS10ZXh0YXJlYS1zZWxlY3RlZC1ib3JkZXItY29sb3IpCn0KCi53LWUtdGV4dC1wbGFjZWhvbGRlciB7CiAgbGVmdDogMTBweDsKICB0b3A6IDE3cHg7CiAgd2lkdGg6IDkwJQp9Cgoudy1lLW1heC1sZW5ndGgtaW5mbywKLnctZS10ZXh0LXBsYWNlaG9sZGVyIHsKICBjb2xvcjogdmFyKC0tdy1lLXRleHRhcmVhLXNsaWdodC1jb2xvcik7CiAgcG9pbnRlci1ldmVudHM6IG5vbmU7CiAgcG9zaXRpb246IGFic29sdXRlOwogIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7CiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsKICB1c2VyLXNlbGVjdDogbm9uZQp9Cgoudy1lLW1heC1sZW5ndGgtaW5mbyB7CiAgYm90dG9tOiAuNWVtOwogIHJpZ2h0OiAxZW0KfQoKLnctZS1iYXIgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10b29sYmFyLWJnLWNvbG9yKTsKICBjb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItY29sb3IpOwogIGZvbnQtc2l6ZTogMTRweDsKICBwYWRkaW5nOiAwIDVweAp9Cgoudy1lLWJhciBzdmcgewogIGZpbGw6IHZhcigtLXctZS10b29sYmFyLWNvbG9yKTsKICBoZWlnaHQ6IDE0cHg7CiAgd2lkdGg6IDE0cHgKfQoKLnctZS1iYXItc2hvdyB7CiAgZGlzcGxheTogZmxleAp9Cgoudy1lLWJhci1oaWRkZW4gewogIGRpc3BsYXk6IG5vbmUKfQoKLnctZS1ob3Zlci1iYXIgewogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS10b29sYmFyLWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogM3B4OwogIGJveC1zaGFkb3c6IDAgMnB4IDVweCAjMDAwMDAwMWY7CiAgcG9zaXRpb246IGFic29sdXRlOwogIGJhY2tncm91bmQ6ICNmZmYgIWltcG9ydGFudDsKfQoKLnctZS10b29sYmFyIHsKICBmbGV4LXdyYXA6IHdyYXA7CiAgcG9zaXRpb246IHJlbGF0aXZlCn0KCi53LWUtYmFyLWRpdmlkZXIgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10b29sYmFyLWJvcmRlci1jb2xvcik7CiAgZGlzcGxheTogaW5saW5lLWZsZXg7CiAgaGVpZ2h0OiA0MHB4OwogIG1hcmdpbjogMCA1cHg7CiAgd2lkdGg6IDFweAp9Cgoudy1lLWJhci1pdGVtIHsKICBkaXNwbGF5OiBmbGV4OwogIGhlaWdodDogNDBweDsKICBwYWRkaW5nOiA0cHg7CiAgcG9zaXRpb246IHJlbGF0aXZlOwogIHRleHQtYWxpZ246IGNlbnRlcgp9Cgoudy1lLWJhci1pdGVtLAoudy1lLWJhci1pdGVtIGJ1dHRvbiB7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcgp9Cgoudy1lLWJhci1pdGVtIGJ1dHRvbiB7CiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyOiBub25lOwogIGNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1jb2xvcik7CiAgY3Vyc29yOiBwb2ludGVyOwogIGRpc3BsYXk6IGlubGluZS1mbGV4OwogIGhlaWdodDogMzJweDsKICBvdmVyZmxvdzogaGlkZGVuOwogIHBhZGRpbmc6IDAgOHB4OwogIHdoaXRlLXNwYWNlOiBub3dyYXAKfQoKLnctZS1iYXItaXRlbSBidXR0b246aG92ZXIgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10b29sYmFyLWFjdGl2ZS1iZy1jb2xvcik7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWFjdGl2ZS1jb2xvcikKfQoKLnctZS1iYXItaXRlbSBidXR0b24gLnRpdGxlIHsKICBtYXJnaW4tbGVmdDogNXB4Cn0KCi53LWUtYmFyLWl0ZW0gLmFjdGl2ZSB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWJnLWNvbG9yKTsKICBjb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWNvbG9yKQp9Cgoudy1lLWJhci1pdGVtIC5kaXNhYmxlZCB7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWRpc2FibGVkLWNvbG9yKTsKICBjdXJzb3I6IG5vdC1hbGxvd2VkCn0KCi53LWUtYmFyLWl0ZW0gLmRpc2FibGVkIHN2ZyB7CiAgZmlsbDogdmFyKC0tdy1lLXRvb2xiYXItZGlzYWJsZWQtY29sb3IpCn0KCi53LWUtYmFyLWl0ZW0gLmRpc2FibGVkOmhvdmVyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcik7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWRpc2FibGVkLWNvbG9yKQp9Cgoudy1lLWJhci1pdGVtIC5kaXNhYmxlZDpob3ZlciBzdmcgewogIGZpbGw6IHZhcigtLXctZS10b29sYmFyLWRpc2FibGVkLWNvbG9yKQp9Cgoudy1lLW1lbnUtdG9vbHRpcC12NTpiZWZvcmUgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10b29sYmFyLWFjdGl2ZS1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogNXB4OwogIGNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcik7CiAgY29udGVudDogYXR0cihkYXRhLXRvb2x0aXApOwogIGZvbnQtc2l6ZTogLjc1ZW07CiAgb3BhY2l0eTogMDsKICBwYWRkaW5nOiA1cHggMTBweDsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdGV4dC1hbGlnbjogY2VudGVyOwogIHRvcDogNDBweDsKICB0cmFuc2l0aW9uOiBvcGFjaXR5IC42czsKICB2aXNpYmlsaXR5OiBoaWRkZW47CiAgd2hpdGUtc3BhY2U6IHByZTsKICB6LWluZGV4OiAxCn0KCi53LWUtbWVudS10b29sdGlwLXY1OmFmdGVyIHsKICBib3JkZXI6IDVweCBzb2xpZCB0cmFuc3BhcmVudDsKICBib3JkZXItYm90dG9tOiA1cHggc29saWQgdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWNvbG9yKTsKICBjb250ZW50OiAiIjsKICBvcGFjaXR5OiAwOwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB0b3A6IDMwcHg7CiAgdHJhbnNpdGlvbjogb3BhY2l0eSAuNnM7CiAgdmlzaWJpbGl0eTogaGlkZGVuCn0KCi53LWUtbWVudS10b29sdGlwLXY1OmhvdmVyOmFmdGVyLAoudy1lLW1lbnUtdG9vbHRpcC12NTpob3ZlcjpiZWZvcmUgewogIG9wYWNpdHk6IDE7CiAgdmlzaWJpbGl0eTogdmlzaWJsZQp9Cgoudy1lLW1lbnUtdG9vbHRpcC12NS50b29sdGlwLXJpZ2h0OmJlZm9yZSB7CiAgbGVmdDogMTAwJTsKICB0b3A6IDEwcHgKfQoKLnctZS1tZW51LXRvb2x0aXAtdjUudG9vbHRpcC1yaWdodDphZnRlciB7CiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogdHJhbnNwYXJlbnQ7CiAgYm9yZGVyLWxlZnQtY29sb3I6IHRyYW5zcGFyZW50OwogIGJvcmRlci1yaWdodC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWNvbG9yKTsKICBib3JkZXItdG9wLWNvbG9yOiB0cmFuc3BhcmVudDsKICBsZWZ0OiAxMDAlOwogIG1hcmdpbi1sZWZ0OiAtMTBweDsKICB0b3A6IDE2cHgKfQoKLnctZS1iYXItaXRlbS1ncm91cCAudy1lLWJhci1pdGVtLW1lbnVzLWNvbnRhaW5lciB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYmctY29sb3IpOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS10b29sYmFyLWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogM3B4OwogIGJveC1zaGFkb3c6IDAgMnB4IDEwcHggIzAwMDAwMDFmOwogIGRpc3BsYXk6IG5vbmU7CiAgbGVmdDogMDsKICBtYXJnaW4tdG9wOiA0MHB4OwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB0b3A6IDA7CiAgei1pbmRleDogMQp9Cgoudy1lLWJhci1pdGVtLWdyb3VwOmhvdmVyIC53LWUtYmFyLWl0ZW0tbWVudXMtY29udGFpbmVyIHsKICBkaXNwbGF5OiBibG9jawp9Cgoudy1lLXNlbGVjdC1saXN0IHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcik7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tdy1lLXRvb2xiYXItYm9yZGVyLWNvbG9yKTsKICBib3JkZXItcmFkaXVzOiAzcHg7CiAgYm94LXNoYWRvdzogMCAycHggMTBweCAjMDAwMDAwMWY7CiAgbGVmdDogMDsKICBtYXJnaW4tdG9wOiA0MHB4OwogIG1heC1oZWlnaHQ6IDM1MHB4OwogIG1pbi13aWR0aDogMTAwcHg7CiAgb3ZlcmZsb3cteTogYXV0bzsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiAwOwogIHotaW5kZXg6IDEKfQoKLnctZS1zZWxlY3QtbGlzdCB1bCB7CiAgbGluZS1oZWlnaHQ6IDE7CiAgbGlzdC1zdHlsZTogbm9uZQp9Cgoudy1lLXNlbGVjdC1saXN0IHVsIC5zZWxlY3RlZCB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWJnLWNvbG9yKQp9Cgoudy1lLXNlbGVjdC1saXN0IHVsIGxpIHsKICBjdXJzb3I6IHBvaW50ZXI7CiAgcGFkZGluZzogN3B4IDAgN3B4IDI1cHg7CiAgcG9zaXRpb246IHJlbGF0aXZlOwogIHRleHQtYWxpZ246IGxlZnQ7CiAgd2hpdGUtc3BhY2U6IG5vd3JhcAp9Cgoudy1lLXNlbGVjdC1saXN0IHVsIGxpOmhvdmVyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1hY3RpdmUtYmctY29sb3IpCn0KCi53LWUtc2VsZWN0LWxpc3QgdWwgbGkgc3ZnIHsKICBsZWZ0OiAwOwogIG1hcmdpbi1sZWZ0OiA1cHg7CiAgbWFyZ2luLXRvcDogLTdweDsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiA1MCUKfQoKLnctZS1iYXItYm90dG9tIC53LWUtc2VsZWN0LWxpc3QgewogIGJvdHRvbTogMDsKICBtYXJnaW4tYm90dG9tOiA0MHB4OwogIG1hcmdpbi10b3A6IDA7CiAgdG9wOiBpbmhlcml0Cn0KCi53LWUtZHJvcC1wYW5lbCB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYmctY29sb3IpOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS10b29sYmFyLWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogM3B4OwogIGJveC1zaGFkb3c6IDAgMnB4IDEwcHggIzAwMDAwMDFmOwogIG1hcmdpbi10b3A6IDQwcHg7CiAgbWluLXdpZHRoOiAyMDBweDsKICBwYWRkaW5nOiAxMHB4OwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB0b3A6IDA7CiAgei1pbmRleDogMQp9Cgoudy1lLWJhci1ib3R0b20gLnctZS1kcm9wLXBhbmVsIHsKICBib3R0b206IDA7CiAgbWFyZ2luLWJvdHRvbTogNDBweDsKICBtYXJnaW4tdG9wOiAwOwogIHRvcDogaW5oZXJpdAp9Cgoudy1lLW1vZGFsIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcik7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tdy1lLXRvb2xiYXItYm9yZGVyLWNvbG9yKTsKICBib3JkZXItcmFkaXVzOiAzcHg7CiAgYm94LXNoYWRvdzogMCAycHggMTBweCAjMDAwMDAwMWY7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWNvbG9yKTsKICBmb250LXNpemU6IDE0cHg7CiAgbWluLWhlaWdodDogNDBweDsKICBtaW4td2lkdGg6IDEwMHB4OwogIHBhZGRpbmc6IDIwcHggMTVweCAwOwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB0ZXh0LWFsaWduOiBsZWZ0OwogIHotaW5kZXg6IDEKfQoKLnctZS1tb2RhbCAuYnRuLWNsb3NlIHsKICBjdXJzb3I6IHBvaW50ZXI7CiAgbGluZS1oZWlnaHQ6IDE7CiAgcGFkZGluZzogNXB4OwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICByaWdodDogOHB4OwogIHRvcDogN3B4Cn0KCi53LWUtbW9kYWwgLmJ0bi1jbG9zZSBzdmcgewogIGZpbGw6IHZhcigtLXctZS10b29sYmFyLWNvbG9yKTsKICBoZWlnaHQ6IDEwcHg7CiAgd2lkdGg6IDEwcHgKfQoKLnctZS1tb2RhbCAuYmFiZWwtY29udGFpbmVyIHsKICBkaXNwbGF5OiBibG9jazsKICBtYXJnaW4tYm90dG9tOiAxNXB4Cn0KCi53LWUtbW9kYWwgLmJhYmVsLWNvbnRhaW5lciBzcGFuIHsKICBkaXNwbGF5OiBibG9jazsKICBtYXJnaW4tYm90dG9tOiAxMHB4Cn0KCi53LWUtbW9kYWwgLmJ1dHRvbi1jb250YWluZXIgewogIG1hcmdpbi1ib3R0b206IDE1cHgKfQoKLnctZS1tb2RhbCBidXR0b24gewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS1tb2RhbC1idXR0b24tYmctY29sb3IpOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS1tb2RhbC1idXR0b24tYm9yZGVyLWNvbG9yKTsKICBib3JkZXItcmFkaXVzOiA0cHg7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWNvbG9yKTsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZm9udC13ZWlnaHQ6IDQwMDsKICBoZWlnaHQ6IDMycHg7CiAgcGFkZGluZzogNC41cHggMTVweDsKICB0ZXh0LWFsaWduOiBjZW50ZXI7CiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247CiAgdHJhbnNpdGlvbjogYWxsIC4zcyBjdWJpYy1iZXppZXIoLjY0NSwgLjA0NSwgLjM1NSwgMSk7CiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsKICAtbW96LXVzZXItc2VsZWN0OiBub25lOwogIHVzZXItc2VsZWN0OiBub25lOwogIHdoaXRlLXNwYWNlOiBub3dyYXAKfQoKLnctZS1tb2RhbCBpbnB1dFt0eXBlPW51bWJlcl0sCi53LWUtbW9kYWwgaW5wdXRbdHlwZT10ZXh0XSwKLnctZS1tb2RhbCB0ZXh0YXJlYSB7CiAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiAidG51bSI7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYmctY29sb3IpOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS1tb2RhbC1idXR0b24tYm9yZGVyLWNvbG9yKTsKICBib3JkZXItcmFkaXVzOiA0cHg7CiAgY29sb3I6IHZhcigtLXctZS10b29sYmFyLWNvbG9yKTsKICBmb250LXZhcmlhbnQ6IHRhYnVsYXItbnVtczsKICBwYWRkaW5nOiA0LjVweCAxMXB4OwogIHRyYW5zaXRpb246IGFsbCAuM3M7CiAgd2lkdGg6IDEwMCUKfQoKLnctZS1tb2RhbCB0ZXh0YXJlYSB7CiAgbWluLWhlaWdodDogNjBweAp9Cgpib2R5IC53LWUtbW9kYWwsCmJvZHkgLnctZS1tb2RhbCAqIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94Cn0KCi53LWUtcHJvZ3Jlc3MtYmFyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdGV4dGFyZWEtaGFuZGxlci1iZy1jb2xvcik7CiAgaGVpZ2h0OiAxcHg7CiAgcG9zaXRpb246IGFic29sdXRlOwogIHRyYW5zaXRpb246IHdpZHRoIC4zczsKICB3aWR0aDogMAp9Cgoudy1lLWZ1bGwtc2NyZWVuLWNvbnRhaW5lciB7CiAgYm90dG9tOiAwICFpbXBvcnRhbnQ7CiAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50OwogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4gIWltcG9ydGFudDsKICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDsKICBsZWZ0OiAwICFpbXBvcnRhbnQ7CiAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7CiAgcGFkZGluZzogMCAhaW1wb3J0YW50OwogIHBvc2l0aW9uOiBmaXhlZDsKICByaWdodDogMCAhaW1wb3J0YW50OwogIHRvcDogMCAhaW1wb3J0YW50OwogIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQKfQoKLnctZS1mdWxsLXNjcmVlbi1jb250YWluZXIgW2RhdGEtdy1lLXRleHRhcmVhPXRydWVdIHsKICBmbGV4OiAxICFpbXBvcnRhbnQKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIGNvZGUgewogIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXctZS10ZXh0YXJlYS1zbGlnaHQtYmctY29sb3IpOwogIGJvcmRlci1yYWRpdXM6IDNweDsKICBmb250LWZhbWlseTogbW9ub3NwYWNlOwogIHBhZGRpbmc6IDNweAp9Cgoudy1lLXBhbmVsLWNvbnRlbnQtY29sb3IgewogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgdGV4dC1hbGlnbjogbGVmdDsKICB3aWR0aDogMjMwcHgKfQoKLnctZS1wYW5lbC1jb250ZW50LWNvbG9yIGxpIHsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogM3B4IDNweDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogIHBhZGRpbmc6IDJweAp9Cgoudy1lLXBhbmVsLWNvbnRlbnQtY29sb3IgbGk6aG92ZXIgewogIGJvcmRlci1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItY29sb3IpCn0KCi53LWUtcGFuZWwtY29udGVudC1jb2xvciBsaSAuY29sb3ItYmxvY2sgewogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXctZS10b29sYmFyLWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogM3B4IDNweDsKICBoZWlnaHQ6IDE3cHg7CiAgd2lkdGg6IDE3cHgKfQoKLnctZS1wYW5lbC1jb250ZW50LWNvbG9yIC5hY3RpdmUgewogIGJvcmRlci1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItY29sb3IpCn0KCi53LWUtcGFuZWwtY29udGVudC1jb2xvciAuY2xlYXIgewogIGxpbmUtaGVpZ2h0OiAxLjU7CiAgbWFyZ2luLWJvdHRvbTogNXB4OwogIHdpZHRoOiAxMDAlCn0KCi53LWUtcGFuZWwtY29udGVudC1jb2xvciAuY2xlYXIgc3ZnIHsKICBoZWlnaHQ6IDE2cHg7CiAgbWFyZ2luLWJvdHRvbTogLTRweDsKICB3aWR0aDogMTZweAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gYmxvY2txdW90ZSB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRleHRhcmVhLXNsaWdodC1iZy1jb2xvcik7CiAgYm9yZGVyLWxlZnQ6IDhweCBzb2xpZCB2YXIoLS13LWUtdGV4dGFyZWEtc2VsZWN0ZWQtYm9yZGVyLWNvbG9yKTsKICBkaXNwbGF5OiBibG9jazsKICBmb250LXNpemU6IDEwMCU7CiAgbGluZS1oZWlnaHQ6IDEuNTsKICBtYXJnaW46IDEwcHggMDsKICBwYWRkaW5nOiAxMHB4Cn0KCi53LWUtcGFuZWwtY29udGVudC1lbW90aW9uIHsKICBmb250LXNpemU6IDIwcHg7CiAgbGlzdC1zdHlsZTogbm9uZTsKICB0ZXh0LWFsaWduOiBsZWZ0OwogIHdpZHRoOiAzMDBweAp9Cgoudy1lLXBhbmVsLWNvbnRlbnQtZW1vdGlvbiBsaSB7CiAgYm9yZGVyLXJhZGl1czogM3B4IDNweDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogIHBhZGRpbmc6IDAgNXB4Cn0KCi53LWUtcGFuZWwtY29udGVudC1lbW90aW9uIGxpOmhvdmVyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdGV4dGFyZWEtc2xpZ2h0LWJnLWNvbG9yKQp9Cgoudy1lLXRleHRhcmVhLWRpdmlkZXIgewogIGJvcmRlci1yYWRpdXM6IDNweDsKICBtYXJnaW46IDIwcHggYXV0bzsKICBwYWRkaW5nOiAwcHgKfQoKLnctZS10ZXh0YXJlYS1kaXZpZGVyIGhyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdGV4dGFyZWEtYm9yZGVyLWNvbG9yKTsKICBib3JkZXI6IDA7CiAgZGlzcGxheTogYmxvY2s7CiAgaGVpZ2h0OiAxcHgKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdGV4dGFyZWEtc2xpZ2h0LWJnLWNvbG9yKTsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13LWUtdGV4dGFyZWEtc2xpZ2h0LWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogNHB4IDRweDsKICBkaXNwbGF5OiBibG9jazsKICBmb250LXNpemU6IDE0cHg7CiAgcGFkZGluZzogMTBweDsKICB0ZXh0LWluZGVudDogMAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gLnctZS1pbWFnZS1jb250YWluZXIgewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBtYXJnaW46IDAgM3B4Cn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudy1lLWltYWdlLWNvbnRhaW5lcjpob3ZlciB7CiAgYm94LXNoYWRvdzogMCAwIDAgMnB4IHZhcigtLXctZS10ZXh0YXJlYS1zZWxlY3RlZC1ib3JkZXItY29sb3IpCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudy1lLXNlbGVjdGVkLWltYWdlLWNvbnRhaW5lciB7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICBwb3NpdGlvbjogcmVsYXRpdmUKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIC53LWUtc2VsZWN0ZWQtaW1hZ2UtY29udGFpbmVyIC53LWUtaW1hZ2UtZHJhZ2dlciB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRleHRhcmVhLWhhbmRsZXItYmctY29sb3IpOwogIGhlaWdodDogN3B4OwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICB3aWR0aDogN3B4Cn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudy1lLXNlbGVjdGVkLWltYWdlLWNvbnRhaW5lciAubGVmdC10b3AgewogIGN1cnNvcjogbndzZS1yZXNpemU7CiAgbGVmdDogMDsKICB0b3A6IDAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIC53LWUtc2VsZWN0ZWQtaW1hZ2UtY29udGFpbmVyIC5yaWdodC10b3AgewogIGN1cnNvcjogbmVzdy1yZXNpemU7CiAgcmlnaHQ6IDA7CiAgdG9wOiAwCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudy1lLXNlbGVjdGVkLWltYWdlLWNvbnRhaW5lciAubGVmdC1ib3R0b20gewogIGJvdHRvbTogMDsKICBjdXJzb3I6IG5lc3ctcmVzaXplOwogIGxlZnQ6IDAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIC53LWUtc2VsZWN0ZWQtaW1hZ2UtY29udGFpbmVyIC5yaWdodC1ib3R0b20gewogIGJvdHRvbTogMDsKICBjdXJzb3I6IG53c2UtcmVzaXplOwogIHJpZ2h0OiAwCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudy1lLXNlbGVjdGVkLWltYWdlLWNvbnRhaW5lcjpob3ZlciB7CiAgYm94LXNoYWRvdzogbm9uZQp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtjb250ZW50ZWRpdGFibGU9ZmFsc2VdIC53LWUtaW1hZ2UtY29udGFpbmVyOmhvdmVyIHsKICBib3gtc2hhZG93OiBub25lCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSAudGFibGUtY29udGFpbmVyIHsKICBib3JkZXI6IDFweCBkYXNoZWQgdmFyKC0tdy1lLXRleHRhcmVhLWJvcmRlci1jb2xvcik7CiAgYm9yZGVyLXJhZGl1czogNXB4OwogIG1hcmdpbi10b3A6IDEwcHg7CiAgb3ZlcmZsb3cteDogYXV0bzsKICBwYWRkaW5nOiAxMHB4OwogIHdpZHRoOiAxMDAlCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSB0YWJsZSB7CiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZQp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gdGFibGUgdGQsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSB0YWJsZSB0aCB7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tdy1lLXRleHRhcmVhLWJvcmRlci1jb2xvcik7CiAgbGluZS1oZWlnaHQ6IDEuNTsKICBtaW4td2lkdGg6IDMwcHg7CiAgcGFkZGluZzogM3B4IDVweDsKICB0ZXh0LWFsaWduOiBsZWZ0Cn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSB0YWJsZSB0aCB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRleHRhcmVhLXNsaWdodC1iZy1jb2xvcik7CiAgZm9udC13ZWlnaHQ6IDcwMDsKICB0ZXh0LWFsaWduOiBjZW50ZXIKfQoKLnctZS1wYW5lbC1jb250ZW50LXRhYmxlIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13LWUtdG9vbGJhci1iZy1jb2xvcikKfQoKLnctZS1wYW5lbC1jb250ZW50LXRhYmxlIHRhYmxlIHsKICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlCn0KCi53LWUtcGFuZWwtY29udGVudC10YWJsZSB0ZCB7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tdy1lLXRvb2xiYXItYm9yZGVyLWNvbG9yKTsKICBjdXJzb3I6IHBvaW50ZXI7CiAgaGVpZ2h0OiAxNXB4OwogIHBhZGRpbmc6IDNweCA1cHg7CiAgd2lkdGg6IDIwcHgKfQoKLnctZS1wYW5lbC1jb250ZW50LXRhYmxlIHRkLmFjdGl2ZSB7CiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdy1lLXRvb2xiYXItYWN0aXZlLWJnLWNvbG9yKQp9Cgoudy1lLXRleHRhcmVhLXZpZGVvLWNvbnRhaW5lciB7CiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjZWVlIDI1JSwgdHJhbnNwYXJlbnQgMCwgdHJhbnNwYXJlbnQgNzUlLCAjZWVlIDAsICNlZWUpLCBsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNlZWUgMjUlLCAjZmZmIDAsICNmZmYgNzUlLCAjZWVlIDAsICNlZWUpOwogIGJhY2tncm91bmQtcG9zaXRpb246IDAgMCwgMTBweCAxMHB4OwogIGJhY2tncm91bmQtc2l6ZTogMjBweCAyMHB4OwogIGJvcmRlcjogMXB4IGRhc2hlZCB2YXIoLS13LWUtdGV4dGFyZWEtYm9yZGVyLWNvbG9yKTsKICBib3JkZXItcmFkaXVzOiA1cHg7CiAgbWFyZ2luOiAxMHB4IGF1dG8gMDsKICBwYWRkaW5nOiAxMHB4IDA7CiAgdGV4dC1hbGlnbjogY2VudGVyCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSB7CiAgd29yZC13cmFwOiBub3JtYWw7CiAgZm9udC1mYW1pbHk6IENvbnNvbGFzLCBNb25hY28sIEFuZGFsZSBNb25vLCBVYnVudHUgTW9ubywgbW9ub3NwYWNlOwogIC13ZWJraXQtaHlwaGVuczogbm9uZTsKICBoeXBoZW5zOiBub25lOwogIGxpbmUtaGVpZ2h0OiAxLjU7CiAgbWFyZ2luOiAuNWVtIDA7CiAgb3ZlcmZsb3c6IGF1dG87CiAgcGFkZGluZzogMWVtOwogIC1tb3otdGFiLXNpemU6IDQ7CiAgLW8tdGFiLXNpemU6IDQ7CiAgdGFiLXNpemU6IDQ7CiAgdGV4dC1hbGlnbjogbGVmdDsKICB0ZXh0LXNoYWRvdzogMCAxcHggI2ZmZjsKICB3aGl0ZS1zcGFjZTogcHJlOwogIHdvcmQtYnJlYWs6IG5vcm1hbDsKICB3b3JkLXNwYWNpbmc6IG5vcm1hbAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmNkYXRhLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmNvbW1lbnQsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uZG9jdHlwZSwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5wcm9sb2cgewogIGNvbG9yOiAjNzA4MDkwCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4ucHVuY3R1YXRpb24gewogIGNvbG9yOiAjOTk5Cn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4ubmFtZXNwYWNlIHsKICBvcGFjaXR5OiAuNwp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmJvb2xlYW4sCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uY29uc3RhbnQsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uZGVsZXRlZCwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5udW1iZXIsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4ucHJvcGVydHksCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uc3ltYm9sLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLnRhZyB7CiAgY29sb3I6ICM5MDUKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5hdHRyLW5hbWUsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uYnVpbHRpbiwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5jaGFyLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmluc2VydGVkLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLnNlbGVjdG9yLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLnN0cmluZyB7CiAgY29sb3I6ICM2OTAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC5sYW5ndWFnZS1jc3MgLnRva2VuLnN0cmluZywKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC5zdHlsZSAudG9rZW4uc3RyaW5nLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmVudGl0eSwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5vcGVyYXRvciwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi51cmwgewogIGNvbG9yOiAjOWE2ZTNhCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uYXRydWxlLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmF0dHItdmFsdWUsCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4ua2V5d29yZCB7CiAgY29sb3I6ICMwN2EKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5jbGFzcy1uYW1lLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmZ1bmN0aW9uIHsKICBjb2xvcjogI2RkNGE2OAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmltcG9ydGFudCwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5yZWdleCwKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi52YXJpYWJsZSB7CiAgY29sb3I6ICNlOTAKfQoKLnctZS10ZXh0LWNvbnRhaW5lciBbZGF0YS1zbGF0ZS1lZGl0b3JdIHByZT5jb2RlIC50b2tlbi5ib2xkLAoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLmltcG9ydGFudCB7CiAgZm9udC13ZWlnaHQ6IDcwMAp9Cgoudy1lLXRleHQtY29udGFpbmVyIFtkYXRhLXNsYXRlLWVkaXRvcl0gcHJlPmNvZGUgLnRva2VuLml0YWxpYyB7CiAgZm9udC1zdHlsZTogaXRhbGljCn0KCi53LWUtdGV4dC1jb250YWluZXIgW2RhdGEtc2xhdGUtZWRpdG9yXSBwcmU+Y29kZSAudG9rZW4uZW50aXR5IHsKICBjdXJzb3I6IGhlbHAKfQoKLkFydGljbGVFZGl0b3IgI3Rvb2xiYXItY29udGFpbmVyIHsKICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHggI2YyZjJmMjsKICBwYWRkaW5nLXJpZ2h0OiAyMHB4Owp9CgouQXJ0aWNsZUVkaXRvciAudy1lLWJhci1kaXZpZGVyIHsKICBkaXNwbGF5OiBub25lOwp9"
  },
  script: {
  }
}, function (container, data, task) {
  const {
    createEditor,
    createToolbar,
    Boot
  } = window.wangEditor

  const toolbarConfig = {
    toolbarKeys: ["headerSelect", "webPage", "localImage", "localVideo", "insertImage", "insertVideo", "blockquote", "|", "bold", "underline", "italic", {
      "key": "group-more-style",
      "title": "更多",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
      "menuKeys": ["through", "code", "sup", "sub", "clearStyle"]
    }, "color", "bgColor", "|", "fontSize", "fontFamily", "lineHeight", "|", "bulletedList", "numberedList", "todo", {
      "key": "group-justify",
      "title": "对齐",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
      "menuKeys": ["justifyLeft", "justifyRight", "justifyCenter", "justifyJustify"]
    }, {
      "key": "group-indent",
      "title": "缩进",
      "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
      "menuKeys": ["indent", "delIndent"]
    }, "|", "emotion", "insertTable", "codeBlock", "divider", "|", "undo", "redo", "|", "fullScreen"],
    excludeKeys: ["fullScreen", "|", "emotion"]
  }

  class WebPageItem {
    constructor() {
      this.title = '插入网页' // 自定义菜单标题
      this.iconSvg = '<svg t="1718860351023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5205" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M224 416h240v240H224zM16 112h992v128H16z" fill="#54FEBD" p-id="5206"></path><path d="M1008 944H16a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h992a16 16 0 0 1 16 16v848a16 16 0 0 1-16 16zM32 912h960V96H32v816z" fill="#1D1B4C" p-id="5207"></path><path d="M944 880H80a16 16 0 0 1-16-16V272a16 16 0 0 1 16-16h864a16 16 0 0 1 16 16v592a16 16 0 0 1-16 16zM96 848h832V288H96v560zM1008 224H16a16 16 0 1 1 0-32h992a16 16 0 1 1 0 32zM816 160c-4.16 0-8.32-1.76-11.36-4.64-2.88-3.04-4.64-7.2-4.64-11.36s1.76-8.32 4.64-11.36c5.92-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.04 4.64-11.36 4.64zM880 160a16.16 16.16 0 0 1-16-16c0-4.16 1.76-8.32 4.64-11.36 5.92-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.04 4.64-11.36 4.64zM944 160a16.16 16.16 0 0 1-16-16c0-4.16 1.76-8.32 4.64-11.36 5.76-5.92 16.8-5.92 22.72 0 2.88 3.04 4.64 7.2 4.64 11.36s-1.76 8.32-4.64 11.36c-3.04 2.88-7.2 4.64-11.36 4.64z" fill="#1D1B4C" p-id="5208"></path><path d="M752 224a16 16 0 0 1-16-16V80a16 16 0 1 1 32 0v128a16 16 0 0 1-16 16zM416 624H176a16 16 0 0 1-16-16V368a16 16 0 0 1 16-16h240a16 16 0 0 1 16 16v240a16 16 0 0 1-16 16z m-224-32h208V384H192v208zM848 384H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 464H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 544H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 624H528a16 16 0 1 1 0-32h320a16 16 0 1 1 0 32zM848 704H176a16 16 0 1 1 0-32h672a16 16 0 1 1 0 32zM848 784H176a16 16 0 1 1 0-32h672a16 16 0 1 1 0 32z" fill="#1D1B4C" p-id="5209"></path></svg>'
      this.tag = 'button'
      this.showModal = true
      this.modalWidth = 500
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      // if (this.isDisabled(editor)) return

    }
    // 弹出框 modal 的定位：1. 返回某一个 SlateNode； 2. 返回 null （根据当前选区自动定位）
    getModalPositionNode(editor) { // JS 语法
      return null // modal 依据选区定位
    }

    // 定义 modal 内部的 DOM Element
    getModalContentElem(editor) {
      let inputId1 = `input-${Math.random().toString(16).slice(-8)}`;
      let inputId2 = `input-${Math.random().toString(16).slice(-8)}`;
      const $content = $(`<div style="padding: 20px 10px;"><div style="margin-bottom: 15px; margin-top: -25px;">插入网页</div><input class="form-control" placeholder="请输入网址(必填)" id=${inputId1} style="width: 100%; margin-bottom: 10px; text-indent: 10px;" /><input class="form-control" placeholder="请输入 rpa 脚本地址" id=${inputId2} style="width: 100%; margin-bottom: 10px; text-indent: 10px;" /></div>`);
      const $button = $('<button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px;">确认插入</button>');
      $content.append($button);

      $button.off("click");
      $button.on('click', (e) => {
        e.preventDefault();
        
        let input1 = container.querySelector("#" + inputId1);
        let input2 = container.querySelector("#" + inputId2);
        if (input1.value) {
          let url = input1.value;
          if(input2.value) {
            url = WebTool.attachParams(url, {
              aScript: input2.value
            });
          }
          let iframe = `<iframe width="100%" src="${url}"></iframe>`
         
          let node = {
            type: "video",
            src: iframe,
            poster: "",
            width: 500,
            height: "auto",
            children: [{
              text: ''
            }]
          }
          editor.restoreSelection(); // 恢复选区
          // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
          editor.insertNode(node);
        }
        return;
      });

      return $content[0] // 返回 DOM Element 类型

      // PS：也可以把 $content 缓存下来，这样不用每次重复创建、重复绑定事件，优化性能
    }
  }

  class LocalImageItem {
    constructor() {
      this.title = '本地图片' // 自定义菜单标题
      this.iconSvg = '<svg viewBox="0 0 1024 1024"><path d="M828.708571 585.045333a48.761905 48.761905 0 0 0-48.737523 48.761905v18.529524l-72.143238-72.167619a135.972571 135.972571 0 0 0-191.585524 0l-34.133334 34.133333-120.880762-120.953905a138.898286 138.898286 0 0 0-191.585523 0l-72.167619 72.167619V292.400762a48.786286 48.786286 0 0 1 48.761904-48.761905h341.23581a48.737524 48.737524 0 0 0 34.474667-83.285333 48.737524 48.737524 0 0 0-34.474667-14.287238H146.236952A146.212571 146.212571 0 0 0 0 292.400762v585.289143A146.358857 146.358857 0 0 0 146.236952 1024h584.996572a146.212571 146.212571 0 0 0 146.236952-146.310095V633.807238a48.786286 48.786286 0 0 0-48.761905-48.761905zM146.261333 926.45181a48.737524 48.737524 0 0 1-48.761904-48.761905v-174.128762l141.409523-141.458286a38.497524 38.497524 0 0 1 53.126096 0l154.526476 154.624 209.627428 209.724953H146.236952z m633.734096-48.761905c-0.073143 9.337905-3.145143 18.383238-8.777143 25.843809l-219.843048-220.94019 34.133333-34.133334a37.546667 37.546667 0 0 1 53.613715 0l140.873143 141.897143V877.714286zM1009.615238 160.231619L863.329524 13.897143a48.737524 48.737524 0 0 0-16.091429-10.24c-11.849143-4.87619-25.161143-4.87619-37.059047 0a48.761905 48.761905 0 0 0-16.067048 10.24l-146.236952 146.334476a49.005714 49.005714 0 0 0 69.217523 69.241905l62.902858-63.390476v272.627809a48.761905 48.761905 0 1 0 97.475047 0V166.083048l62.902857 63.390476a48.737524 48.737524 0 0 0 69.217524 0 48.761905 48.761905 0 0 0 0-69.241905z"></path></svg>'
      this.tag = 'button'
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      if (this.isDisabled(editor)) return
      // 创建一个input，用于选择本地视频文件
      const imageInput = document.createElement('input');
      imageInput.type = 'file';
      imageInput.accept = 'image/*';
      imageInput.style.display = 'none';

      // 监听change事件，当文件选择后触发
      imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64String = e.target.result;
            let node = {
              type: "image",
              src: base64String,
              poster: "",
              width: 300,
              height: "auto",
              children: [{
                text: ''
              }]
            }
            // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
            editor.insertNode(node);
          };
          reader.readAsDataURL(file);
        }
      });

      // 触发input点击，打开文件选择对话框
      imageInput.click();
    }
  }

  class LocalVideoItem {
    constructor() {
      this.title = '本地视频' // 自定义菜单标题
      this.iconSvg = '<svg viewBox="0 0 1056 1024"><path d="M805.902261 521.819882a251.441452 251.441452 0 0 0-251.011972 246.600033 251.051015 251.051015 0 1 0 502.023944 8.823877 253.237463 253.237463 0 0 0-251.011972-255.42391z m59.463561 240.001647v129.898403h-116.701631v-129.898403h-44.041298l101.279368-103.504859 101.279368 103.504859z"></path><path d="M788.254507 0.000781H99.094092A98.663439 98.663439 0 0 0 0.001171 99.093701v590.067495a98.663439 98.663439 0 0 0 99.092921 99.092921h411.7549a266.434235 266.434235 0 0 1-2.186448-41.815807 275.843767 275.843767 0 0 1 275.180024-270.729042 270.650955 270.650955 0 0 1 103.504859 19.834201V99.093701A101.51363 101.51363 0 0 0 788.254507 0.000781zM295.054441 640.747004V147.507894l394.146189 246.600033z"></path></svg>'
      this.tag = 'button'
    }

    getValue(editor) { // JS 语法
      return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) { // JS 语法
      return false
    }

    isDisabled(editor) { // JS 语法
      return false
    }
    // 点击菜单时触发的函数
    exec(editor, value) { // JS 语法
      if (this.isDisabled(editor)) return
      // 创建一个input，用于选择本地视频文件
      const videoInput = document.createElement('input');
      videoInput.type = 'file';
      videoInput.accept = 'video/*';
      videoInput.style.display = 'none';

      // 监听change事件，当文件选择后触发
      videoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64String = e.target.result;

            let node = {
              type: "video",
              src: base64String,
              poster: "",
              width: 300,
              height: "auto",
              children: [{
                text: ''
              }]
            }
            // editor.dangerouslyInsertHtml("<div>（视频占位符）</div>")
            editor.insertNode(node);
          };
          reader.readAsDataURL(file);
        }
      });

      // 触发input点击，打开文件选择对话框
      videoInput.click();
    }
  }

  let toolItem = container.querySelector(".toolbar-container");
  toolItem.id = "tool_" + new Date().getTime();
  let editorItem = container.querySelector(".editor-container");
  editorItem.id = "editor_" + new Date().getTime();

  task.data = task.data || "";
  if (typeof task.data !== "string") {
    task.data = "";
  }
  let loadingText = "加载内容...";
  setTimeout(function () {
    const editor = createEditor({
      selector: '#' + editorItem.id,
      html: loadingText,
      config: {
        placeholder: '请在此处开始输入内容',
        onChange(editor) {
          const html = editor.getHtml();
          if (html) {
            task.data = html;
            if (loadingText !== html && typeof task.changeCallback === "function") {
              task.changeCallback(task.data);
            }
          }
        },
        customPaste(editor, event) {
          pasteCallback(event);
          return true
        }
      },
      mode: 'simple', // or 'simple'
    });

    task.editor = editor;
    window.theEditor = editor;

    let config = editor.getConfig();

    if (!config.MENU_CONF['localVideo']) {
      const localVideoConf = {
        key: 'localVideo', // 
        factory() {
          return new LocalVideoItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(localVideoConf)
    }

    if (!config.MENU_CONF['webPage']) {
      const webPageConf = {
        key: 'webPage', // 
        factory() {
          return new WebPageItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(webPageConf)
    }

    if (!config.MENU_CONF['localImage']) {
      const localImageConf = {
        key: 'localImage', // 
        factory() {
          return new LocalImageItem() // 把 `YourMenuClass` 替换为你菜单的 class
        },
      }

      Boot.registerMenu(localImageConf)
    }


    config.MENU_CONF.codeSelectLang.codeLangs = [{
      text: 'DSL',
      value: 'dsl'
    }, {
      text: 'Javascript',
      value: 'javascript'
    }, {
      text: 'HTML',
      value: 'html'
    }]

    // 配置字体
    config.MENU_CONF.fontFamily.fontFamilyList = [{
        name: "方正黑体",
        value: "方正黑体"
      },
      '汉仪仿宋',
      '方正楷体',
      '方正书宋',
      '微软雅黑',
      '粉笔字',
      'Arial',
      'Fredericka',
      'FrankRuhl'
    ]

    config.MENU_CONF['uploadImage'] = {
      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 10 * 1024 * 1024 // 5mb
    }

    const toolbar = createToolbar({
      editor,
      selector: '#' + toolItem.id,
      config: toolbarConfig,
      mode: 'default', // or 'simple'
    })

    let tConfig = toolbar.getConfig();
    console.log("toolbar config", tConfig);
    window.tConfig = tConfig;


    let tempHtml = task.data || "";
    setTimeout(function () {
      let h = $(container).find("#" + toolItem.id).height();
      $(container).find("#" + editorItem.id).css({
        height: `calc( 100% - ${h + 15}px )`
      });
      if (task.typingStyleOutput) {
        webCpu.ArticleEditor.typingStyleOutput(task, tempHtml);
      } else {
        editor.setHtml(tempHtml || "");
      }
    }, 200)

  }, 500);

  let pasteCallback = (event) => {
    const d = (event.clipboardData || event.originalEvent.clipboardData || window.clipboardData);
    const items = d.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // 判断是否为图片

      if (item.kind === "file") {
        const blob = item.getAsFile();
        const reader = new FileReader();
        let type = item.type;
        // 读取图片文件
        reader.onload = function (e) {
          let content = e.target.result;
          if (type.indexOf('image') !== -1) {
            const img = new Image();
            img.src = content;
            // 将图片添加到粘贴区域
            // container.appendChild(img);
            task.editor.dangerouslyInsertHtml(`<img src="${img.src}" width="700px" height="auto" />`);
          }
        };
        if (blob) {
          reader.readAsDataURL(blob);
        }
        event.preventDefault();
      }
    }
  }
});

webCpu.ArticleEditor.typingStyleOutput = function (card, content, n) {
  let t = card.task || card;
  let container = document.createElement("div");
  container.innerHTML = content;
  let arr = container.childNodes;
  n = n || 100;
  var i = 0;
  t.editor.setHtml("");
  clearInterval(webCpu.ArticleEditor.typingInterval);
  webCpu.ArticleEditor.typingInterval = setInterval(function () {

    let count = arr.length - 1;
    if (i > count) {
      clearInterval(webCpu.ArticleEditor.typingInterval);
      return false;
    }
    let tContainer = document.createElement("div");
    let tNode = arr[i].cloneNode(true);
    tContainer.appendChild(tNode);
    let eItem = $(t.container).find(".w-e-scroll")[0];
    // 将光标移动到内容末尾
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(eItem.childNodes[0]);
    range.collapse(false); // 移动到末尾
    selection.removeAllRanges();
    selection.addRange(range);

    t.editor.dangerouslyInsertHtml(tContainer.innerHTML || "");

    let height = eItem.scrollHeight;
    eItem.scrollTop = height;

    // 
    i++;
  }, n); // 每500毫秒添加一行
}