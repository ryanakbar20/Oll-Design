<table role="presentation" valign="top" border="0" cellspacing="0" cellpadding="0"
    width="512" align="center"
    style="margin:0 auto;width:512px;max-width:512px;background-color:#ffffff;padding:0;">
    <tbody>
        <tr>
            <td style="padding:24px;text-align:center">
                <table role="presentation" valign="top" border="0" cellspacing="0" cellpadding="0" width="100%"
                    style="min-width:100%">
                    <tbody>
                        <tr>
                            <td align="left" valign="middle">
                                {{-- Optional header image/logo bisa kamu tambahkan di sini --}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding:0;">
                <div>
                    <table role="presentation" valign="top" border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tbody>
                            <tr>
                                <td
                                    style="border-bottom:1px solid #e6e6e6;padding:24px;font-family:Arial,Helvetica,sans-serif;">
                                    <table role="presentation" valign="top" border="0" cellspacing="0" cellpadding="0"
                                        width="100%">
                                        <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:16px;font-weight:600;line-height:1.5;color:#282828;padding-top:8px;">
                                                    {{ $name }} 様より
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="left"
                                                    style="font-size:14px;font-weight:500;line-height:1.5;color:#282828;padding-top:8px;">
                                                    御社名 / Company Name : {{ $company }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="left"
                                                    style="font-size:14px;font-weight:500;line-height:1.5;color:#282828;padding-top:4px;">
                                                    メールアドレス / Email Address : {{ $email }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="left"
                                                    style="font-size:14px;font-weight:500;line-height:1.5;color:#282828;padding-top:4px;">
                                                    電話番号 / Contact Number : {{ $phone }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="left"
                                                    style="font-size:15px;font-weight:600;line-height:1.5;color:#282828;padding-top:16px;">
                                                    お問い合わせ内容:
                                                </td>
                                            </tr>

                                            <tr>
                                                <td align="left"
                                                    style="font-size:14px;font-weight:400;line-height:1.6;color:#282828;padding-top:4px;">
                                                    {{ $question }}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding-top:24px;text-align:center;">
                                                    <table role="presentation" border="0" cellspacing="0"
                                                        cellpadding="0" align="center"
                                                        style="margin:0 auto;border-collapse:separate;">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="border-radius:24px;padding:12px 24px;text-align:center;font-size:16px;font-weight:600;background-color:#fff;color:#0a66c2;border:1px solid #0a66c2;line-height:1.25;">
                                                                    <a href="mailto:{{ $email }}"
                                                                        style="color:#0a66c2;text-decoration:none;">
                                                                        Contact {{ $name }}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="height:16px;" height="16"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    </tbody>
</table>
