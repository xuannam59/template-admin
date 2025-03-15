import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permissions'

const GeneralSettingPage = () => {
    return (
        <Access
            permission={ALL_PERMISSIONS.SETTINGS.GET}
        >
            <div>GeneralSettingPage</div>
        </Access>
    )
}

export default GeneralSettingPage