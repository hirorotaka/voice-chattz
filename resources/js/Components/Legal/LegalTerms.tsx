import React from "react";

const LegalTerms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                voice chattz サービス利用規約
            </h1>

            <div className="prose prose-slate max-w-none">
                <p className="mb-8">
                    このウェブサイト上で提供するサービス「voice
                    chattz」（以下、「本サービス」）の利用条件を定める規約です。
                    登録ユーザーの皆さま（以下、「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">第1条（適用）</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            本規約は、ユーザーと本サービスの利用に関わる一切の関係に適用されます。
                        </li>
                        <li>
                            本サービスは、本規約のほかに必要に応じて個別規定を定めることがあります。個別規定は本規約の一部を構成します。
                        </li>
                        <li>
                            個別規定と本規約の規定が矛盾する場合、特段の定めがない限り個別規定が優先されます。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第2条（利用登録）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            利用登録は以下の手順で完了します：
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>登録希望者が本規約に同意</li>
                                <li>所定の方法で利用登録を申請</li>
                                <li>本サービスが申請を承認</li>
                            </ul>
                        </li>
                        <li>
                            以下の場合、利用登録を承認しないことがあります：
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>虚偽の情報を届け出た場合</li>
                                <li>過去に本規約違反があった場合</li>
                                <li>
                                    その他、本サービスが適当でないと判断した場合
                                </li>
                            </ul>
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第3条（ユーザーIDおよびパスワードの管理）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            ユーザーは自己の責任において、氏名・メールアドレス・パスワードを適切に管理するものとします。
                        </li>
                        <li>
                            登録情報の第三者への譲渡・貸与・共用は禁止します。登録情報と一致するログインは、本人による利用とみなします。
                        </li>
                        <li>
                            第三者による不正使用で生じた損害について、本サービスは責任を負いません。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第4条（利用料金）
                    </h2>
                    <p>
                        本サービスは無料でご利用いただけます。利用料金の請求はありません。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第5条（禁止事項）
                    </h2>
                    <p className="mb-4">以下の行為を禁止します：</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>法令・公序良俗違反</li>
                        <li>犯罪行為関連</li>
                        <li>知的財産権の侵害</li>
                        <li>システムやネットワークの妨害</li>
                        <li>商業的利用</li>
                        <li>サービス運営の妨害</li>
                        <li>不正アクセス</li>
                        <li>個人情報の不正収集</li>
                        <li>不正目的での利用</li>
                        <li>他者への損害・不快感を与える行為</li>
                        <li>なりすまし</li>
                        <li>無断の宣伝・営業行為</li>
                        <li>出会い目的の利用</li>
                        <li>反社会的勢力への利益供与</li>
                        <li>その他不適切と判断される行為</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第6条（サービスの提供停止）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            以下の場合、事前通知なくサービスを停止することがあります：
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>システムの保守点検・更新時</li>
                                <li>不可抗力（地震・天災等）の場合</li>
                                <li>システム障害発生時</li>
                                <li>その他、提供が困難と判断した場合</li>
                            </ul>
                        </li>
                        <li>
                            サービス停止による損害について、一切の責任を負いません。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第7条（利用制限・登録抹消）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            以下の場合、事前通知なく利用制限や登録抹消を行うことがあります：
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>規約違反</li>
                                <li>虚偽の登録情報が判明</li>
                                <li>連絡不応答</li>
                                <li>長期間の未利用</li>
                                <li>その他不適切と判断される場合</li>
                            </ul>
                        </li>
                        <li>
                            上記措置による損害について、一切の責任を負いません。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">第8条（退会）</h2>
                    <p>所定の退会手続により、いつでも退会できます。</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第9条（保証の否認・免責事項）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            本サービスの完全性・正確性等について、一切の保証をしません。
                        </li>
                        <li>
                            ユーザーの損害について、一切の責任を負いません。
                        </li>
                        <li>
                            ユーザー間または第三者との紛争について、一切責任を負いません。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第10条（サービス内容の変更）
                    </h2>
                    <p>
                        事前告知なくサービス内容を変更・追加・廃止することがあります。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第11条（利用規約の変更）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>個別の同意なく本規約を変更できます。</li>
                        <li>
                            規約変更後のサービス利用をもって、変更への同意とみなします。
                        </li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第12条（個人情報の取扱い）
                    </h2>
                    <p>
                        個人情報は「プライバシーポリシー」に従って適切に取り扱います。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第13条（通知・連絡）
                    </h2>
                    <p>
                        本サービスが定める方法で通知・連絡を行い、登録済みの連絡先への発信をもって到達したものとみなします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第14条（権利義務の譲渡禁止）
                    </h2>
                    <p>
                        事前承諾なく、契約上の地位や権利義務を第三者に譲渡・担保提供することはできません。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        第15条（準拠法・裁判管轄）
                    </h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>本規約の解釈には日本法を適用します。</li>
                        <li>
                            紛争が生じた場合、本サービス運営者所在地の裁判所を専属的合意管轄とします。
                        </li>
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default LegalTerms;
