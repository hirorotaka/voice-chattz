<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:30',
            'first_message' => 'required|string',
            'description' => 'required|string',
            'language_id' => 'required|exists:languages,id', // languagesテーブルのidと紐づいているか確認
        ];
    }

    /**
     * バリデーションエラーのカスタム属性名
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => '役割名',
            'first_message' => '初回メッセージ',
            'description' => '説明',
            'language_id' => '対話モード',
        ];
    }


    /**
     * バリデーションエラーのメッセージ
     * @return array
     */

    public function messages()
    {
        return [
            'name.required' => ':attributeを入力してください。',
            'name.string' => ':attributeは文字列で入力してください。',
            'name.max' => ':attributeは:max文字以内で入力してください。',
            'first_message.required' => ':attributeを入力してください。',
            'description.required' => ':attributeを入力してください。',
            'language_id.required' => ':attributeを選択してください。',
        ];
    }
}
