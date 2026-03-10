import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconAlertTriangle } from '@/components/ui/Icons'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark islamic-pattern">
            <Card className="max-w-md w-full border-red-500/20 bg-dark-surface/50 backdrop-blur-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <IconAlertTriangle size={40} className="text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-light font-[family-name:var(--font-poppins)]">
                        Ralat Pengesahan
                    </h1>
                    <p className="text-light-muted text-sm leading-relaxed">
                        Maaf, terdapat masalah semasa memproses log masuk anda. Sila cuba lagi atau hubungi pentadbir jika masalah berterusan.
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Link href="/login">
                        <Button variant="primary" className="w-full">
                            Kembali ke Log Masuk
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Halaman Utama
                        </Button>
                    </Link>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-light-muted/50 uppercase tracking-widest">
                        Technical Error: Auth Code Exchange Failed
                    </p>
                </div>
            </Card>
        </div>
    )
}
